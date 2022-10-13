import React from 'react';

interface Props {
  [key: string]: any
}

interface State {
  date: Date
}

class Clock extends React.Component<Props, State> {
  timerID: undefined | NodeJS.Timer;

  constructor(props: Props) {
    super(props);
    console.log(props);
    this.state = {
      date: new Date(),
    };
  }

  tick() {
    this.setState({ date: new Date() });
  }

  componentDidMount(): void {
    this.timerID = setInterval(
      () => this.tick(),
      1000,
    );
  }

  componentWillUnmount(): void {
    clearInterval(this.timerID);
  }

  render(): React.ReactNode {
    return (
      <div>
        <h1>{ this.state.date.toLocaleTimeString() }</h1>
      </div>
    )
  }
}

export default Clock;