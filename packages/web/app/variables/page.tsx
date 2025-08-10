'use client';

import {VariablesContainer} from "@/components/variables/variables-container";
import { KeyCreationFlow } from "@/components/variables/key-creation-flow";

export default function VariablesPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <VariablesContainer/>
      <KeyCreationFlow />
    </div>
  );
}