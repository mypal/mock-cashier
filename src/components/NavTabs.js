import React, { Component } from 'react';
import { connect } from 'react-redux';
import { switchTabs } from '../actions';

class NavTabs extends Component {
    constructor() {
        super();
        this.handleSwitch = this.handleSwitch.bind(this);
    }
    handleSwitch(idx) {
        if (this.props.currentIndex == idx) {
            return;
        }
        this.props.switchTabs(idx);
    }
    render() {
        let { list, currentIndex } = this.props;
        let Container = list[currentIndex].container;
        return (
            <div style={{padding: '0 10px'}}>
                <ul className="nav nav-tabs" style={{marginBottom: '5px'}}>
                    {list.map((item, idx)=> {
                        return <li role="presentation" key={'tabs'+idx} className={currentIndex == idx ? 'active' : ''} onClick={() => {this.handleSwitch(idx)}}><a href="#">{item.name}</a></li>
                    })}
                </ul>
                <Container />
            </div>
        );
    }
}

NavTabs.propTypes = {
    list: React.PropTypes.array.isRequired,
    currentIndex: React.PropTypes.number.isRequired,
    switchTabs: React.PropTypes.func.isRequired
};

function mapStateToProps(state) {
    const { navTabs } = state;
    return {
        currentIndex: navTabs.get('currentIndex')
    }
}

export default connect(mapStateToProps, { switchTabs })(NavTabs);
