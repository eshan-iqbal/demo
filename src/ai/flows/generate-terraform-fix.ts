'use server';

/**
 * @fileOverview Generates Terraform code to fix detected security issues.
 *
 * - generateTerraformFix - A function that generates Terraform code to fix security issues.
 * - GenerateTerraformFixInput - The input type for the generateTerraformFix function.
 * - GenerateTerraformFixOutput - The return type for the generateTerraformFix function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTerraformFixInputSchema = z.object({
  securityIssueDescription: z
    .string()
    .describe('A description of the security issue that needs to be fixed.'),
  currentTerraformCode: z
    .string()
    .optional()
    .describe('The current Terraform code that needs to be modified.'),
});
export type GenerateTerraformFixInput = z.infer<typeof GenerateTerraformFixInputSchema>;

const GenerateTerraformFixOutputSchema = z.object({
  fixedTerraformCode: z
    .string()
    .describe('The Terraform code that fixes the security issue.'),
});
export type GenerateTerraformFixOutput = z.infer<typeof GenerateTerraformFixOutputSchema>;

export async function generateTerraformFix(input: GenerateTerraformFixInput): Promise<GenerateTerraformFixOutput> {
  return generateTerraformFixFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTerraformFixPrompt',
  input: {schema: GenerateTerraformFixInputSchema},
  output: {schema: GenerateTerraformFixOutputSchema},
  prompt: `You are a security expert specializing in Terraform code.

You will be given a description of a security issue and, optionally, the current Terraform code.

You will generate Terraform code that fixes the security issue.

Security Issue Description: {{{securityIssueDescription}}}
Current Terraform Code (if available): {{{currentTerraformCode}}}

Fixed Terraform Code:`,
});

const generateTerraformFixFlow = ai.defineFlow(
  {
    name: 'generateTerraformFixFlow',
    inputSchema: GenerateTerraformFixInputSchema,
    outputSchema: GenerateTerraformFixOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
