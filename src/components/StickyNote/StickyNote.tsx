import React from 'react';
import './StickyNote.scss';
import Draggable from 'react-draggable';
import { createTheme, IconButton, TextField, Input, ThemeProvider } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NoteMenu from './NoteMenu/NoteMenu';

interface Props {
  title?: string;
  content?: string;
  color?: string;
  id: number | string;
  x?: number;
  y?: number;
  handleDelete(id: string | number): void; 
  handleCopy(id: string | number, title: string, content: string, color: string): void;
}

interface State {
  title: string;
  content: string;
  color: string;
  isMenuOpen: boolean;
  editable: boolean;
  firstFoucus: string;
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
  private nodeRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      title: props.title || '',
      content: props.content || '',
      color: props.color || '#d9d9d9',
      isMenuOpen: false,
      editable: false,
      firstFoucus: '',
    };
    this.moreButton = React.createRef();
    this.nodeRef = React.createRef();
  }

  handleChange(newVal: any) {
    this.setState(newVal);
  }

  handleMenuOpen = () => {
    this.handleChange({ isMenuOpen: !this.state.isMenuOpen });
  }

  handleMenuClick = (event: string, ...params: any) => {
    switch (event) {
      case 'delete':
        this.props.handleDelete(this.props.id);
        break;
      case 'copy':
        this.props.handleCopy(this.props.id, this.state.title, this.state.content, this.state.color);
        break;
    }
    this.setState({ isMenuOpen: false });
  }

  handleEditable = (e: React.MouseEvent) => {
    this.handleChange({ editable: true });
    const { id } = e.target as HTMLElement;
    this.setState({ firstFoucus: id || 'title-input'});
  }

  handleBlur = (e: React.FocusEvent) => {
    if (e.relatedTarget) {
      e.preventDefault();
      this.handleChange({ firstFoucus: e.relatedTarget.id || 'title-input'});
    } else {
      this.handleChange({ editable: false, firstFoucus: '' });
    }
  }

  render() {
    const titleColor: React.CSSProperties ={
      backgroundColor: this.state.color,
    };

    return (
      <Draggable
        nodeRef={ this.nodeRef }
        bounds="parent"
        defaultPosition={{x: this.props.x || 0, y: this.props.y || 0}}
      >
        <div className="sticky-note-container"
          ref={ this.nodeRef }
          onDoubleClickCapture={ this.handleEditable }
          onBlur={ this.handleBlur }
        >
          <ThemeProvider theme={theme}>
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
                id="title-input"
                inputRef={(input: HTMLInputElement) => input && input.id === this.state.firstFoucus && input.focus()}
                disabled={ !this.state.editable }
                value={ this.state.title }
                className="sticky-note-title-input"
                placeholder="Task Title"
                fullWidth
                onChange={(e) => this.handleChange({title: e.target.value})}
              />
            </div>
            <TextField
              id="content-input"
              inputRef={(input: HTMLTextAreaElement) => input && input.id === this.state.firstFoucus && input.focus()}
              disabled={ !this.state.editable }
              value={ this.state.content }
              className="sticky-note-content"
              variant="standard"
              placeholder="Write down anything!"
              multiline
              rows={ 8 }
              fullWidth
              focused={ true }
              onChange={(e) => this.handleChange({content: e.target.value})}
            />
          </ThemeProvider>
          <NoteMenu
            isOpen={ this.state.isMenuOpen }
            anchorEl={ this.moreButton.current }
            handleClick={ this.handleMenuClick }
            onClose={ this.handleMenuOpen }
          />
        </div>
      </Draggable>
    )
  }
}

export default StickyNote;