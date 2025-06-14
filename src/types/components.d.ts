declare interface ButtonProps {
  title: string;
  onPress: () => void;
}

declare interface CanvasProps {
  backgroundUri: string;
  texts: any[];
  onUpdateText: (id: string, value: string) => void;
  onMoveText: (id: string, x: number, y: number) => void;
  onRemoveText: (id: string) => void;
  onDuplicateText: (id: string) => void;
}

declare interface EditableTextProps {
  text: {
    id: string;
    value: string;
    x: number;
    y: number;
  };
  onUpdateText: (id: string, value: string) => void;
  onMoveText: (id: string, x: number, y: number) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}
