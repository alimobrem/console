import { useMemo } from 'react';
import type { ClusterServiceVersionKind } from '@openshift-console/olm-types';
import { ClusterServiceVersionModel } from '@openshift-console/olm-types';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';
import { referenceForModel } from '@console/internal/module/k8s';

type CsvWatchResource = {
  csvData: ClusterServiceVersionKind[];
  csvLoaded: boolean;
  csvError: {};
};
export const useCsvWatchResource = (ns: string): CsvWatchResource => {
  const csvResource = useMemo(
    () => ({
      isList: true,
      kind: referenceForModel(ClusterServiceVersionModel),
      namespace: ns,
      optional: true,
    }),
    [ns],
  );

  const [csvData, csvLoaded, csvError] = useK8sWatchResource<ClusterServiceVersionKind[]>(
    csvResource,
  );
  return { csvData, csvLoaded, csvError };
};
