import ToolEngine from "./ToolEngine";

interface ToolWorkspaceProps {
  toolId: string;
}

export default function ToolWorkspace({ toolId }: ToolWorkspaceProps) {
  return <ToolEngine toolId={toolId} />;
}
