import {AbstractBaseInterface, DataList, DefaultSelect, Props as GivenProps, States} from "../base";


export type DataType = Array<DataList>

export type Props = GivenProps & { data: DataType };

export default class StaticSelect extends DefaultSelect<Props, States> implements AbstractBaseInterface {
    private index: number;

    getLayer(): DataList {
        return this.props.data[this.index];
    }

    moveForward(): false | void {
        if (++this.index >= this.props.data.length) {
            return false;
        }
    }

    reset(isInitial: boolean): void {
        super.reset(isInitial)
        this.index = 0;
    }
}
