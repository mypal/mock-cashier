import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeJs } from '../actions';

class LocalData extends Component {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.props.changeJs(e.target.value);
    }
    render() {
        return (
            <form>
                <div className="form-group">
                    <label htmlFor="localJs">JS代码</label>
                    <textarea className="form-control" id="localJs" rows="10" placeholder="请输入JS代码" onChange={this.handleChange} />
                </div>
            </form>
        );
    }
}

LocalData.propTypes = {
};

function mapStateToProps() {
    return {
    }
}

export default connect(mapStateToProps, { changeJs })(LocalData);
