import Sheet from "@/components/ui/Sheet";
import UserSearch from "./UserSearch";

type Props = { visible: boolean; onClose: () => void };

export default function SideMenu({ visible, onClose }: Props) {
  return (
    <Sheet visible={visible} title="Amigos" onClose={onClose}>
      {visible && <UserSearch />}
    </Sheet>
  );
}
