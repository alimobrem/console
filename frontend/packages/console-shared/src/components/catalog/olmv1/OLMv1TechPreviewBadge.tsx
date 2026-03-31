import type { FC } from 'react';
import { Button, Label, Popover } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { useTranslation } from 'react-i18next';

// TODO(CONSOLE-4823): Remove when OLMv1 GAs
export const OLMv1TechPreviewBadge: FC = () => {
  const { t } = useTranslation();

  const popoverContent = (
    <div>
      {t(
        'console-shared~Lets you use OLMv1 (Tech Preview), a streamlined redesign of OLMv0. OLMv1 simplifies operator management with declarative APIs, enhanced security, and direct, GitOps-friendly control over upgrades.',
      )}
    </div>
  );

  return (
    <>
      <Label color="yellow" isCompact variant="outline">
        {t('console-shared~Tech Preview')}
      </Label>{' '}
      <Popover aria-label={t('console-shared~OLMv1 information')} bodyContent={popoverContent}>
        <Button
          icon={<OutlinedQuestionCircleIcon aria-hidden="true" />}
          aria-label={t('console-shared~OLMv1 information')}
          variant="link"
          isInline
        />
      </Popover>
    </>
  );
};
