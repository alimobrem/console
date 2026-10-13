import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Divider,
  FocusTrap,
  MenuToggle,
  Popper,
  Skeleton,
  ToggleGroup,
  ToggleGroupItem,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { IS_OPENSHIFT_5 } from '@console/app/src/features/openshift5';
import { useTelemetry } from '@console/shared/src/hooks/useTelemetry';
import { useUserPreference } from '@console/shared/src/hooks/useUserPreference';
import {
  CONTRAST_USER_PREFERENCE_KEY,
  THEME_DEFAULT,
  THEME_SYSTEM_DEFAULT,
  THEME_USER_PREFERENCE_KEY,
} from '../../../providers/theme/theme-constants';

import './ThemeSelector.scss';

const COLOR_SCHEMES = ['light', 'dark', THEME_SYSTEM_DEFAULT] as const;
const CONTRAST_MODES = [THEME_DEFAULT, 'glass', 'contrast', THEME_SYSTEM_DEFAULT] as const;

type ColorScheme = (typeof COLOR_SCHEMES)[number];
type ContrastMode = (typeof CONTRAST_MODES)[number];

const isColorScheme = (value: string): value is ColorScheme =>
  COLOR_SCHEMES.includes(value as ColorScheme);

const isContrastMode = (value: string): value is ContrastMode =>
  CONTRAST_MODES.includes(value as ContrastMode);

const ThemeSelector: FC = () => {
  const { t } = useTranslation('console-app');
  // Same source of truth as ThemeProvider, so the controls always match what is applied
  const isOpenShift5 = IS_OPENSHIFT_5;
  const fireTelemetryEvent = useTelemetry();
  const [isOpen, setIsOpen] = useState(false);
  // Trap focus only once the panel is visible, otherwise it has no tabbable nodes yet
  const [isTrapActive, setIsTrapActive] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [colorScheme, setColorScheme, colorSchemeLoaded] = useUserPreference<string>(
    THEME_USER_PREFERENCE_KEY,
    THEME_SYSTEM_DEFAULT,
    true,
  );
  const [contrastMode, setContrastMode, contrastModeLoaded] = useUserPreference<string>(
    CONTRAST_USER_PREFERENCE_KEY,
    THEME_SYSTEM_DEFAULT,
    true,
  );

  const selectedColorScheme = isColorScheme(colorScheme) ? colorScheme : THEME_SYSTEM_DEFAULT;
  const selectedContrastMode = isContrastMode(contrastMode) ? contrastMode : THEME_SYSTEM_DEFAULT;
  const loaded = colorSchemeLoaded && (!isOpenShift5 || contrastModeLoaded);

  useEffect(() => {
    if (colorSchemeLoaded && !isColorScheme(colorScheme)) {
      setColorScheme(THEME_SYSTEM_DEFAULT);
    }
  }, [colorScheme, colorSchemeLoaded, setColorScheme]);

  useEffect(() => {
    if (isOpenShift5 && contrastModeLoaded && !isContrastMode(contrastMode)) {
      setContrastMode(THEME_SYSTEM_DEFAULT);
    }
  }, [contrastMode, contrastModeLoaded, isOpenShift5, setContrastMode]);

  const getColorSchemeLabel = (value: ColorScheme): string => {
    switch (value) {
      case 'light':
        return t('Light');
      case 'dark':
        return t('Dark');
      default:
        return t('System default');
    }
  };

  const getContrastModeLabel = (value: ContrastMode): string => {
    switch (value) {
      case 'default':
        return t('Traditional');
      case 'glass':
        return t('Glass');
      case 'contrast':
        return t('High contrast');
      default:
        return t('System default');
    }
  };

  const colorSchemeLabel = getColorSchemeLabel(selectedColorScheme);
  const contrastModeLabel = getContrastModeLabel(selectedContrastMode);
  const summary = isOpenShift5
    ? t('{{contrastMode}} · {{colorScheme}}', {
        contrastMode: contrastModeLabel,
        colorScheme: colorSchemeLabel,
      })
    : colorSchemeLabel;

  const selectColorScheme = (value: ColorScheme) => {
    if (value !== selectedColorScheme) {
      setColorScheme(value);
      fireTelemetryEvent('User Preference Changed', {
        property: THEME_USER_PREFERENCE_KEY,
        value,
      });
    }
  };

  const selectContrastMode = (value: ContrastMode) => {
    if (value !== selectedContrastMode) {
      setContrastMode(value);
      fireTelemetryEvent('User Preference Changed', {
        property: CONTRAST_USER_PREFERENCE_KEY,
        value,
      });
    }
  };

  if (!loaded) {
    return <Skeleton height="30px" width="100%" data-test="theme-selector-skeleton" />;
  }

  const panelId = 'console-theme-panel';
  // Land focus on the current selection rather than the first option
  const initialFocusId = isOpenShift5
    ? `#theme-contrast-${selectedContrastMode}`
    : `#theme-color-${selectedColorScheme}`;
  const isToggle = (target: EventTarget | null) =>
    target instanceof Node && !!toggleRef.current?.contains(target);

  return (
    <Popper
      isVisible={isOpen}
      onHidden={() => setIsTrapActive(false)}
      onShown={() => setIsTrapActive(true)}
      placement="bottom-start"
      width="trigger"
      trigger={
        <MenuToggle
          aria-controls={panelId}
          aria-haspopup="dialog"
          aria-label={t('Theme: {{summary}}', { summary })}
          data-test="theme-selector-toggle"
          id="console.theme"
          isExpanded={isOpen}
          isFullWidth
          onClick={() => setIsOpen(!isOpen)}
          ref={toggleRef}
        >
          {summary}
        </MenuToggle>
      }
      popper={
        <FocusTrap
          active={isOpen && isTrapActive}
          aria-label={t('Theme')}
          className="co-theme-selector"
          data-test="theme-selector-panel"
          focusTrapOptions={{
            // The toggle handles its own clicks so it can close the panel
            allowOutsideClick: (event) => isToggle(event.target),
            clickOutsideDeactivates: (event) => !isToggle(event.target),
            initialFocus: initialFocusId,
            onDeactivate: () => setIsOpen(false),
            returnFocusOnDeactivate: true,
            // Visibility is already guaranteed by onShown; matches PatternFly Popover
            tabbableOptions: { displayCheck: 'none' },
          }}
          id={panelId}
          role="dialog"
        >
          {isOpenShift5 && (
            <>
              <div className="co-theme-selector__section" data-test="console.theme/contrast field">
                <h3 className="co-theme-selector__label" id="console-theme-contrast-label">
                  {t('Contrast mode')}
                </h3>
                <ToggleGroup
                  aria-labelledby="console-theme-contrast-label"
                  className="co-theme-selector__toggle-group"
                  isCompact
                >
                  {CONTRAST_MODES.map((value) => (
                    <ToggleGroupItem
                      buttonId={`theme-contrast-${value}`}
                      isSelected={selectedContrastMode === value}
                      key={value}
                      onChange={(_event, selected) => selected && selectContrastMode(value)}
                      text={getContrastModeLabel(value)}
                    />
                  ))}
                </ToggleGroup>
              </div>
              <Divider className="co-theme-selector__divider" />
            </>
          )}
          <div className="co-theme-selector__section" data-test="console.theme/color-scheme field">
            <h3 className="co-theme-selector__label" id="console-theme-color-label">
              {t('Color scheme')}
            </h3>
            <ToggleGroup
              aria-labelledby="console-theme-color-label"
              className="co-theme-selector__toggle-group"
              isCompact
            >
              {COLOR_SCHEMES.map((value) => (
                <ToggleGroupItem
                  buttonId={`theme-color-${value}`}
                  isSelected={selectedColorScheme === value}
                  key={value}
                  onChange={(_event, selected) => selected && selectColorScheme(value)}
                  text={getColorSchemeLabel(value)}
                />
              ))}
            </ToggleGroup>
          </div>
        </FocusTrap>
      }
    />
  );
};

export default ThemeSelector;
