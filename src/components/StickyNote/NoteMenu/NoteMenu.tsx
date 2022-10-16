import { ListItemText, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

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

const colors: string[] = ['red', 'blue'];

interface Props {
  isOpen: boolean;
  anchorEl: HTMLButtonElement | null;
  onClose(): void;
}

export default function NoteMenu(props: Props) {
  const [openCascade, setOpenCascade] = useState<boolean>(false);
  const [colorsAnchorEl, setColorsAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenCascade = (e: React.MouseEvent<HTMLElement>) => {
    setColorsAnchorEl(e.currentTarget);
    setOpenCascade(true);
  }

  const handleCloseCascade = () => {
    setOpenCascade(false);
    setColorsAnchorEl(null);
  }

  return (
    <Menu
      open={ props.isOpen }
      anchorEl = { props.anchorEl }
      onClose={ props.onClose }
    >
      { menuItems.map(v => {
        return (
          <MenuItem
            key={ v.text }
            onClick={ v.text === 'Color' ? handleOpenCascade : () => {}}
          >
            <ListItemText style={{ width: '40px' }}>{ v.icon }</ListItemText>
            <ListItemText style={{ textAlign: 'left', width: '140px' }}>{ v.text }</ListItemText>
          </MenuItem>
        )
      })}
      <Menu
        open={ openCascade }
        anchorEl={ colorsAnchorEl }
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={ handleCloseCascade }
      >
        {
          colors.map((color) => {
            return (
              <MenuItem key={color}>{ color }</MenuItem>
            )
          })
        }
      </Menu>
    </Menu>
  )
}