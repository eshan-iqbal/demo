'use server';

/**
 * @fileOverview Explains the generated Terraform fix to the user.
 *
 * - explainTerraformFix - A function that takes in the Terraform fix and explains it.
 * - ExplainTerraformFixInput - The input type for the explainTerraformFix function.
 * - ExplainTerraformFixOutput - The return type for the explainTerraformFix function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainTerraformFixInputSchema = z.object({
  terraformFix: z.string().describe('The generated Terraform fix.'),
});
export type ExplainTerraformFixInput = z.infer<typeof ExplainTerraformFixInputSchema>;

const ExplainTerraformFixOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the generated Terraform fix.'),
});
export type ExplainTerraformFixOutput = z.infer<typeof ExplainTerraformFixOutputSchema>;

export async function explainTerraformFix(input: ExplainTerraformFixInput): Promise<ExplainTerraformFixOutput> {
  return explainTerraformFixFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainTerraformFixPrompt',
  input: {schema: ExplainTerraformFixInputSchema},
  output: {schema: ExplainTerraformFixOutputSchema},
  prompt: `You are an expert in Terraform and cloud infrastructure.

You will be given a Terraform fix, and you will explain the changes being made to the infrastructure in a way that is easy to understand for a user with limited knowledge of Terraform.

Terraform fix:
{{{terraformFix}}}`,
});

const explainTerraformFixFlow = ai.defineFlow(
  {
    name: 'explainTerraformFixFlow',
    inputSchema: ExplainTerraformFixInputSchema,
    outputSchema: ExplainTerraformFixOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
