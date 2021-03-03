import Ux from 'ux';
import {Avatar, Card, List} from 'antd';
import React from "react";
import Image from './images';

export default (reference) => {
    const {$menus = []} = reference.state;
    return (
        <List dataSource={$menus} className={"item-list"} renderItem={item => (
            <Card className={"item-content"} onClick={event => {
                Ux.prevent(event);
                // module -> mid
                Ux.toRoute(reference, item.uri, {mid: item.key});
            }}>
                <Card.Meta avatar={
                    <Avatar shape="square" src={Image[item.icon]}
                            style={{width: 24, height: 24}}/>
                } title={item.text} description={item.description}/>
            </Card>
        )}/>
    )
}