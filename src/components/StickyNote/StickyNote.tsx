import React from 'react';
import './StickyNote.scss';
import { createTheme, IconButton, TextField, Input, ThemeProvider } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface Props {
  title?: string;
  content?: string;
  color?: string;
}

interface State {
  title: string;
  content: string;
  color: string;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#AAAAAA',
    },
  },
});

class StickyNote extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      title: props.title || '',
      content: props.content || '',
      color: props.color || '#d9d9d9',
    }
  }

  handleChange(field: keyof State, val: string) {
    this.setState({[field]: val} as Pick<State, keyof State>);
  }

  render() {
    const titleColor: React.CSSProperties ={
      backgroundColor: this.state.color,
    };

    return (
      <ThemeProvider theme={theme}>
        <div className="sticky-note-container">
          <IconButton
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
            }}
            color="primary"
            className="sticky-note-more"
          >
            <MoreHorizIcon />
          </IconButton>
          <div className="sticky-note-title" style={ titleColor }>
            <Input
              value={ this.state.title }
              className="sticky-note-title-input"
              placeholder="Task Title"
              fullWidth
              onChange={(e) => this.handleChange('title', e.target.value)}
            />
          </div>
          <TextField
            value={ this.state.content }
            className="sticky-note-content"
            variant="standard"
            placeholder="Write down anything!"
            multiline
            rows={8}
            maxRows={10}
            fullWidth
            onChange={(e) => this.handleChange('content', e.target.value)}
          />
        </div>
      </ThemeProvider>
    )
  }
}

export default StickyNote;