import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Clock from './Clock';
import StickyNote from './StickyNote/StickyNote';
import './Board.scss';

export default function Board() {
  return (
    <div className="board">
      <Button variant="text" size="large" startIcon={<AddIcon />}>Add</Button>
      <Clock />
      <StickyNote />
    </div>
  )
}