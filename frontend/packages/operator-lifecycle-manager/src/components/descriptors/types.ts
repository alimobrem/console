// Canonical definitions live in @openshift-console/olm-types.
export {
  DescriptorType,
  SpecCapability,
  StatusCapability,
  CommonCapability,
} from '@openshift-console/olm-types';

export type {
  Descriptor,
  SpecDescriptor,
  StatusDescriptor,
  CapabilityProps,
} from '@openshift-console/olm-types';

// This type is OLM-internal and not shared via olm-types
export type Error = { message: string };
