// @ts-ignore
import React, {Component} from "react";
import {FlatList, Text, View} from "react-native";
import TouchableAnyFeedback from "./utils/touchable";
import styles from "./base.styles";
import Modal from "react-native-modal";
import {Random} from "./utils/random";
import stringConstants from "string-constants";

export interface DataObject {
    label: string;
    value: any;
}

export type DataList = Array<DataObject>;

export interface AbstractBaseInterface {
    render(): React.ReactNode;

    getLayer(): Array<DataObject>;

    moveForward(item: DataObject): void | false;

    stopNow(): void;

    reset(isInitial: boolean): void;
}


export type DataType = Array<DataList>;

export type Props = {
    data: DataType;
    onDone: Function;
    onAbort: Function;
    isVisible: boolean;
    onPartial?: Function;
}

export type States = {}

export abstract class DefaultSelect<P extends Props, S extends States, T = any> extends Component {
    public readonly props: P;
    protected readonly values: T[];
    protected done: boolean;
    private usedIds: Set<string> = new Set();

    protected get lastValue() {
        return this.values[this.values.length - 1]
    }

    componentDidMount() {
        this.reset(true);
    }

    render(): React.ReactNode {
        if (this.done) {
            return null;
        }
        // @ts-ignore
        return this.createComponent(this.getLayer());
    }

    stopNow(): void {
        this.done = true;
        this.props.onDone(this.values);
        // @ts-ignore
        this.reset();
    }

    reset(isInitial: boolean): void {
        this.done = false;
        // @ts-ignore
        // noinspection JSConstantReassignment
        this.values = [];
    }

    protected handleTouch(value: any, item: DataObject): void {
        this.values.push(value);

        if (this.props.onPartial !== undefined) {
            this.props.onPartial.bind(this)();
        }

        // @ts-ignore
        if (this.moveForward(item) === false) {
            this.stopNow();
        }

        // @ts-ignore
        this.forceUpdate();
    }

    protected renderItem({item}): React.ReactNode {
        const self = this;

        return (
            <View>
                <TouchableAnyFeedback onPress={() => self.handleTouch(item.value, item)}>
                    <View style={styles.button}>
                        <Text>{item.label}</Text>
                    </View>
                </TouchableAnyFeedback>
            </View>
        );
    }

    protected createComponent(values: DataList): React.ReactNode {
        const self = this;

        // @ts-ignore
        return <Modal
            onSwipeComplete={() => self.props.onAbort()}
            swipeDirection="down"
            onBackdropPress={() => self.props.onAbort()}
            onBackButtonPress={() => self.props.onAbort()}
            isVisible={this.props.isVisible}
        >
            <View style={styles.wrapper}>
                <FlatList
                    data={values}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={() => self.createRandomId(values.length)}
                />
            </View>
        </Modal>;
    }

    protected createRandomId(amount: number): string {
        // amount = ascii^length
        let id: string;

        do {
            id = Random.choice(
                stringConstants.asciiLetters,
                Math.log10(amount) / Math.log10(stringConstants.asciiLetters.length)
            ).join("")
        } while (id in this.usedIds)

        this.usedIds.add(id);

        return id;
    }
}
