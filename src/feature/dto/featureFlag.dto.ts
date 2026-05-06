export type FeatureFlagResponseDto = {
  id: number;
  key: string;
  isEnabled: boolean;
  organizationId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type FeatureFlagCheckResponseDto = {
  key: string;
  enabled: boolean;
};

