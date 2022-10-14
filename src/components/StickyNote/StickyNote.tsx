import React from 'react';
import './StickyNote.scss';
import { createTheme, IconButton, TextField, Input, ThemeProvider } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NoteMenu from './NoteMenu/NoteMenu'

interface Props {
  title?: string;
  content?: string;
  color?: string;
}

interface State {
  title: string;
  content: string;
  color: string;
  isMenuOpen: boolean;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#AAAAAA',
    },
    secondary: {
      main: '#999999'
    }
  },
});

class StickyNote extends React.Component<Props, State> {
  private moreButton: React.RefObject<HTMLButtonElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      title: props.title || '',
      content: props.content || '',
      color: props.color || '#d9d9d9',
      isMenuOpen: false,
    }
    this.moreButton = React.createRef();
  }

  handleChange(newVal: any) {
    this.setState(newVal);
  }

  handleMenuOpen = () => {
    this.handleChange({ isMenuOpen: !this.state.isMenuOpen });
  }

  render() {
    const titleColor: React.CSSProperties ={
      backgroundColor: this.state.color,
    };

    return (
      <ThemeProvider theme={theme}>
        <div className="sticky-note-container">
          <IconButton
            ref={ this.moreButton }
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              '&:hover': {
                color: 'secondary.main',
              },
            }}
            color="primary"
            className="sticky-note-more"
            onClick={ this.handleMenuOpen }
          >
            <MoreHorizIcon />
          </IconButton>
          <div className="sticky-note-title" style={ titleColor }>
            <Input
              value={ this.state.title }
              className="sticky-note-title-input"
              placeholder="Task Title"
              fullWidth
              onChange={(e) => this.handleChange({title: e.target.value})}
            />
          </div>
          <TextField
            value={ this.state.content }
            className="sticky-note-content"
            variant="standard"
            placeholder="Write down anything!"
            multiline
            rows={ 8 }
            fullWidth
            onChange={(e) => this.handleChange({content: e.target.value})}
          />
        </div>
        <NoteMenu
          isOpen={ this.state.isMenuOpen }
          anchorEl={ this.moreButton.current }
          onClose={ this.handleMenuOpen }
        />
      </ThemeProvider>
    )
  }
}

export default StickyNote;