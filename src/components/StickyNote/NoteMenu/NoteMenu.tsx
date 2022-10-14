import { ListItemText, Menu, MenuItem } from '@mui/material';

const menuItems = [
  {
    icon: '🙌',
    text: 'Done',
  },
  {
    icon: '🗑️',
    text: 'Delete',
  },
  {
    icon: '🎨',
    text: 'Color',
  },
  {
    icon: '©️',
    text: 'Copy',
  },
];

interface Props {
  isOpen: boolean;
  anchorEl: HTMLButtonElement | null;
  onClose(): void;
}

export default function NoteMenu(props: Props) {

  return (
    <Menu
      open={ props.isOpen }
      anchorEl = { props.anchorEl }
      onClose={ props.onClose }
    >
      { menuItems.map(v => {
        return (
          <MenuItem key={ v.text }>
            <ListItemText style={{ width: '40px' }}>{ v.icon }</ListItemText>
            <ListItemText style={{ textAlign: 'left', width: '140px' }}>{ v.text }</ListItemText>
          </MenuItem>
        )
      })}
    </Menu>
  )
}