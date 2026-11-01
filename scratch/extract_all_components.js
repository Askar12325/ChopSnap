const fs = require('fs');
const path = require('path');

const pageContent = fs.readFileSync('frontend/src/app/page.tsx', 'utf-8');
const lines = pageContent.split(/\r?\n/);

const compDir = path.join('frontend', 'src', 'features', 'chopsnap', 'components');
const screenDir = path.join('frontend', 'src', 'features', 'chopsnap', 'screens');
if (!fs.existsSync(compDir)) fs.mkdirSync(compDir, { recursive: true });
if (!fs.existsSync(screenDir)) fs.mkdirSync(screenDir, { recursive: true });

// 1. Header.tsx (lines 2087 to 2171)
const headerBody = lines.slice(2086, 2171).join('\n');
const headerContent = `"use client";

import React from "react";
import { ChopSnapLogo } from "@/components/ChopSnapLogo";
import { Sun, Moon, Info } from "lucide-react";
import { ProcessResponse } from "../types";

export interface HeaderProps {
  resetAll: () => void;
  data: ProcessResponse | null;
  isBackendHealthy: boolean | null;
  isDark: boolean;
  toggleTheme: () => void;
  setShowOpenWeightModal: (show: boolean) => void;
}

export function Header({
  resetAll,
  data,
  isBackendHealthy,
  isDark,
  toggleTheme,
  setShowOpenWeightModal,
}: HeaderProps) {
  return (
${headerBody}
  );
}
`;
fs.writeFileSync(path.join(compDir, 'Header.tsx'), headerContent, 'utf-8');
console.log('Wrote Header.tsx');

// 2. ActiveScanBar.tsx (lines 2174 to 2210)
const scanBarInner = lines.slice(2175, 2210).join('\n');
const scanBarContent = `"use client";

import React from "react";
import { Camera, RotateCcw } from "lucide-react";
import { ProcessResponse } from "../types";

export interface ActiveScanBarProps {
  data: ProcessResponse | null;
  selectedFile: File | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  resetAll: () => void;
}

export function ActiveScanBar({
  data,
  selectedFile,
  fileInputRef,
  resetAll,
}: ActiveScanBarProps) {
  if (!data) return null;

  return (
${scanBarInner}
  );
}
`;
fs.writeFileSync(path.join(compDir, 'ActiveScanBar.tsx'), scanBarContent, 'utf-8');
console.log('Wrote ActiveScanBar.tsx');

// 3. Footer.tsx (lines 4203 to 4241)
const footerBody = lines.slice(4202, 4241).join('\n');
const footerContent = `"use client";

import React from "react";
import { ChopSnapLogo } from "@/components/ChopSnapLogo";
import { ProcessResponse } from "../types";

export interface FooterProps {
  data: ProcessResponse | null;
  configuredRecipeModel: string;
}

export function Footer({ data, configuredRecipeModel }: FooterProps) {
  return (
${footerBody}
  );
}
`;
fs.writeFileSync(path.join(compDir, 'Footer.tsx'), footerContent, 'utf-8');
console.log('Wrote Footer.tsx');

// 4. OpenWeightModal.tsx (lines 4244 to 4324)
const modalInner = lines.slice(4244, 4323).join('\n');
const modalContent = `"use client";

import React from "react";
import { ShieldCheck, X, Coins, Lock, Cpu } from "lucide-react";

export interface OpenWeightModalProps {
  showOpenWeightModal: boolean;
  setShowOpenWeightModal: (show: boolean) => void;
}

export function OpenWeightModal({
  showOpenWeightModal,
  setShowOpenWeightModal,
}: OpenWeightModalProps) {
  if (!showOpenWeightModal) return null;

  return (
${modalInner}
  );
}
`;
fs.writeFileSync(path.join(compDir, 'OpenWeightModal.tsx'), modalContent, 'utf-8');
console.log('Wrote OpenWeightModal.tsx');

// 5. HowItWorksSection.tsx (lines 2794 to 2850)
const howItWorksBody = lines.slice(2793, 2850).join('\n');
const howItWorksContent = `"use client";

import React from "react";

export function HowItWorksSection() {
  return (
${howItWorksBody}
  );
}
`;
fs.writeFileSync(path.join(screenDir, 'HowItWorksSection.tsx'), howItWorksContent, 'utf-8');
console.log('Wrote HowItWorksSection.tsx');

// 6. TryExampleSection.tsx (lines 2858 to 2935)
const tryExampleBody = lines.slice(2857, 2935).join('\n');
const tryExampleContent = `"use client";

import React from "react";
import { Zap, Store, ArrowRight, Layers, Salad } from "lucide-react";

export interface TryExampleSectionProps {
  handleLoadSample: (sampleType: "market" | "pantry" | "native") => void;
}

export function TryExampleSection({ handleLoadSample }: TryExampleSectionProps) {
  return (
${tryExampleBody}
  );
}
`;
fs.writeFileSync(path.join(screenDir, 'TryExampleSection.tsx'), tryExampleContent, 'utf-8');
console.log('Wrote TryExampleSection.tsx');

// 7. LoadingScreen.tsx (lines 3220 to 3300)
const loadingInner = lines.slice(3220, 3300).join('\n');
const loadingContent = `"use client";

import React from "react";
import { ChefHat, Sparkles, CheckCircle2, RefreshCw, Circle } from "lucide-react";

export interface LoadingScreenProps {
  loading: boolean;
  pipelinePhase: "vision" | "recipes";
  statusStep: string;
  progressStage: number;
}

export function LoadingScreen({
  loading,
  pipelinePhase,
  statusStep,
  progressStage,
}: LoadingScreenProps) {
  if (!loading) return null;

  return (
${loadingInner}
  );
}
`;
fs.writeFileSync(path.join(screenDir, 'LoadingScreen.tsx'), loadingContent, 'utf-8');
console.log('Wrote LoadingScreen.tsx');
