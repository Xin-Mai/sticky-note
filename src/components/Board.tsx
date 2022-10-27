import { Button, createTheme, Theme, ThemeProvider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Clock from './Clock/Clock';
import StickyNote from './StickyNote/StickyNote';
import './Board.scss';
import { useState } from 'react';

interface IStickyNote {
  id: number;
  x?: number;
  y?: number;
  content?: string;
  title?: string;
  color?: string;
}

const buttonStyles = {
  // color: '#61dafb',
  position: 'fixed',
  top: 0,
  right: 0,
};

const myTheme: Theme = createTheme({
  palette: {
    primary: {
      main: '#61dafb',
    },
    action: {
      disabled: 'rgba(97,218,251, 0.6)'
    }
  }
});

export default function Board() {
  const [counter, setCounter] = useState<number>(0);
  const [stickyNotes, setStickyNotes] = useState<IStickyNote[]>([]);

  const addStickyNote = (note?: Partial<IStickyNote>) => {
    const { x, y, content, title, color } = note || {};
    setStickyNotes([
      ...stickyNotes,
      {
        id: counter,
        x: x || stickyNotes.length * 20,
        y: y || stickyNotes.length * 20,
        content,
        color,
        title,
      },
    ]);
    setCounter(counter + 1);
  };

  const removeStickyNote = (id: number | string) => {
    const newStickyNotes = stickyNotes.filter(note => note.id !== id);
    setStickyNotes(newStickyNotes);
  }

  const copyStickyNote = (id: string | number, title: string, content: string, color: string) => {
    addStickyNote({
      title,
      content,
      color,
    });
  }

  return (
    <div className="board">
      <ThemeProvider theme={ myTheme }>
        <div className="board-center">
          <Clock />
        </div>
        <Button
            sx={ buttonStyles }
            variant="text"
            size="large"
            startIcon={ <AddIcon /> }
            className="board-add"
            onClick={() => addStickyNote()} 
          >
              Add TASK
        </Button>
      </ThemeProvider>
      {
        stickyNotes.map(note => {
          return (
            <StickyNote
              key={note.id}
              id={note.id}
              x={note.x}
              y={note.y}
              content={note.content}
              title={note.title}
              color={note.color}
              handleDelete={removeStickyNote}
              handleCopy={copyStickyNote}
            />
          )
        })
      }
    </div>
  )
}