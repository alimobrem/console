import { Alert } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from '../../links/ExternalLink';

// TODO(CONSOLE-4823): Remove when OLMv1 GAs
const OLMv1Alert = () => {
  const { t } = useTranslation('console-shared');
  return (
    <Alert
      variant="info"
      title={t('Operator Lifecycle Management version 1')}
      actionLinks={
        <ExternalLink href={`${window.SERVER_FLAGS.documentationBaseURL}/html/extensions/index`}>
          {t('Learn more about OLMv1')}
        </ExternalLink>
      }
    >
      {t(
        "With OLMv1, you'll get a much simpler API that's easier to work with and understand. Plus, you have more direct control over updates. You can define update ranges and decide exactly how they are rolled out.",
      )}
    </Alert>
  );
};

export default OLMv1Alert;
