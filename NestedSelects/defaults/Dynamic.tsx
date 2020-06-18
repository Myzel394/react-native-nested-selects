import {AbstractBaseInterface, DataList, DataObject, DefaultSelect, Props as GivenProps, States} from "../base";

export type Props = GivenProps & { data: DataList };

export default class DynamicSelect extends DefaultSelect<Props, States> implements AbstractBaseInterface {
    private current: DataList;

    moveForward(item: DataObject): void | false {
        const nextLevel = item["nextLevel"];

        switch (typeof (nextLevel)) {
            case "function":
                this.current = nextLevel(this);
                break;
            case "object":
                this.current = nextLevel;
                break;
            case "undefined":
                return false;
            default:
                throw Error(`The specified nextLevel's value couldn't be resolved as type.`)
        }
    }

    getLayer(): DataList {
        return this.current;
    }

    reset(isInitial: boolean): void {
        super.reset(isInitial)
        this.current = this.props.data;
    }


    /*
    Example data:
    [
        {
            label: "A",
            value: "a",
            nextLevel: [
                {
                    label: "A - 1",
                    value: 1,
                },
                {
                    label: "A - 2",
                    value: 2"
                }
            ]
        },
        {
            label: "B",
            value: "b",
            nextLevel: [
                {
                    label: "B - 1",
                    value: 1,
                },
                {
                    label: "B - 2",
                    value: 2,
                },
                {
                    label: "B - 3",
                    value: 3,
                },
                {
                    label: "B - 4",
                    value: 4
                }
            ]
        },
        {
            label: "C",
            value: "c",
            nextLevel: () => {
                const random = Math.random() > .5;

                return [
                    {
                        label: "1",
                        value: 1,
                    },
                    {
                        label: random ? "Yes" : "No",
                        value: random
                    }
                ]
            }
        }
    ]

    **/
}
