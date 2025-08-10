'use client';

import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useRef } from "react";
import { useAtom, useSetAtom } from "jotai";
import { keyConfigAtom, exportConfigAtom, importConfigAtom } from "@/atoms/localStorage";
import { useToast } from "@/hooks/use-toast";

export function ImportExportControls() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportConfig = useSetAtom(exportConfigAtom);
  const importConfig = useSetAtom(importConfigAtom);
  const { toast } = useToast();

  const handleExport = () => {
    try {
      exportConfig();
      toast({
        title: "成功",
        description: "配置已导出",
      });
    } catch (error) {
      toast({
        title: "错误",
        description: "导出失败",
        variant: "destructive",
      });
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importConfig(file);
      toast({
        title: "成功",
        description: "配置已导入",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        title: "错误",
        description: `导入失败: ${error instanceof Error ? error.message : '未知错误'}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handleExport}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        导出配置
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        导入配置
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
}