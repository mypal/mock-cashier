//require('normalize.css/normalize.css');
require('bootstrap/less/bootstrap.less');
require('../styles/App.less');
import React from 'react';
import NavTabs from './NavTabs';
import LocalData from './LocalData';
import OnlineData from './OnlineData';
import MockCashier from './MockCashier';

class AppComponent extends React.Component {
    render() {
        return (
            <div className="row" style={{marginTop: '5px'}}>
                <div className="col-md-7 col-md-offset-1">
                    <MockCashier/>
                </div>
                <div className="col-md-3">
                    <NavTabs list={[{
                        name: '后端读取',
                        container: OnlineData
                    }/*, {
                        name: '手动填充',
                        container: LocalData
                    }*/]}/>
                </div>
            </div>
        );
    }
}

AppComponent.defaultProps = {
};

export default AppComponent;
