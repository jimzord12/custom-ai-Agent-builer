import { z } from 'zod';

// Base enums for consistent values
const StatusEnum = z.enum(['Not Started', 'In Progress', 'Completed', 'Blocked']);
const PriorityEnum = z.enum(['Low', 'Medium', 'High', 'Critical']);
const ComplexityEnum = z.enum(['Low', 'Medium', 'High']);
const AssigneeTypeEnum = z.enum(['ai-agent', 'human']);
const FeatureTypeEnum = z.enum(['new-feature', 'bug-fix', 'improvement', 'doc', 'chore']);

// Assignee schema
const AssigneeSchema = z.object({
  type: AssigneeTypeEnum,
  name: z.string()
});

// Task schema
const TaskSchema = z.object({
  id: z.uuidv4(),
  name: z.string(),
  status: StatusEnum,
  estimatedTime: z.string(),
  priority: PriorityEnum,
  assignee: z.string().nullable(),
  affectedFiles: z.array(z.string()),
  dependencies: z.array(z.string())
});

// Phase schema
const PhaseSchema = z.object({
  id: z.uuidv4(),
  name: z.string(),
  status: StatusEnum,
  duration: z.string(),
  assignees: z.array(AssigneeSchema),
  tasks: z.array(TaskSchema),
  dependencies: z.array(z.string()).optional()
});

// Feature schema (with optional fields for different feature types)
const FeatureSchema = z.object({
  id: z.uuidv4(),
  name: z.string(),
  status: StatusEnum,
  owner: AssigneeSchema,
  branch: z.string(),
  originBranch: z.string().optional(),
  createdDate: z.string(),
  type: FeatureTypeEnum,
  phases: z.array(PhaseSchema)
});

// Main project status schema
const ProjectStatusSchema = z.object({
  projectName: z.string(),
  lastUpdated: z.string(),
  version: z.string(),
  features: z.array(FeatureSchema)
});

// Type exports for TypeScript usage
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;
export type Feature = z.infer<typeof FeatureSchema>;
export type Phase = z.infer<typeof PhaseSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type Assignee = z.infer<typeof AssigneeSchema>;

// Export the schemas for validation
export { AssigneeSchema, AssigneeTypeEnum, ComplexityEnum, FeatureSchema, PhaseSchema, PriorityEnum, ProjectStatusSchema, StatusEnum, TaskSchema };

// Validation function for ProjectStatus
export const validateProjectStatus = (data: unknown): ProjectStatus => {
  return ProjectStatusSchema.parse(data);
};

// Safe validation function for ProjectStatus (returns error instead of throwing)
export const safeValidateProjectStatus = (data: unknown) => {
  return ProjectStatusSchema.safeParse(data);
};

// Validation function for Feature
export const validateFeature = (data: unknown): Feature => {
  return FeatureSchema.parse(data);
};

// Safe validation function for Feature (returns error instead of throwing)
export const safeValidateFeature = (data: unknown) => {
  return FeatureSchema.safeParse(data);
};

// Validation function for Phase
export const validatePhase = (data: unknown): Phase => {
  return PhaseSchema.parse(data);
};

// Safe validation function for Phase (returns error instead of throwing)
export const safeValidatePhase = (data: unknown) => {
  return PhaseSchema.safeParse(data);
};

// Validation function for Task
export const validateTask = (data: unknown): Task => {
  return TaskSchema.parse(data);
};

// Safe validation function for Task (returns error instead of throwing)
export const safeValidateTask = (data: unknown) => {
  return TaskSchema.safeParse(data);
};

// Validation function for Assignee
export const validateAssignee = (data: unknown): Assignee => {
  return AssigneeSchema.parse(data);
};

// Safe validation function for Assignee (returns error instead of throwing)
export const safeValidateAssignee = (data: unknown) => {
  return AssigneeSchema.safeParse(data);
};
3;
