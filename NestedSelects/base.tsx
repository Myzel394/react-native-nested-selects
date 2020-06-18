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
    /**
     * Default render as you know
     */
    render(): React.ReactNode;

    /**
     * This returns the current available selects. This DOES NOT change the selects. Use `moveForward` to change the
     * current selects!
     * @return: Array of DataObject
     */
    getLayer(): Array<DataObject>;

    /**
     * This changes the current selects.
     * E.g.: StaticSelect has got an `index` and in this function the index will be add by 1.
     * If there are no selects available, return `false`. If there are selects available, return nothing (aka. `void`).
     * @param item
     */
    moveForward(item: DataObject): void | false;

    /**
     * You will probably not override that.
     * Will be called after `moveForward` returns `false`.
     */
    stopNow(): void;

    /**
     * Resets everything. Will also be called on initialization.
     * @param isInitial: boolean - Whether this is called on initialization.
     */
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
            // Return nothing to avoid showing last selects again.
            console.warn(`Component ${this} shouldn't be visible anymore. 
            Did you forget to call \`.reset()\` or to properly set the visibility?`);
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
