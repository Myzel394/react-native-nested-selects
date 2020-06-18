export class Random {

    public static int(max: number, min: number = 0): number {
        return Math.round(Math.random() * (max - min) + min)
    }

    public static choice(list_or_string, k: number) {
        const list: Array<any> = Array.isArray(list_or_string) ? list_or_string : list_or_string.split(""),
            listLength = list.length,
            found: Array<any> = [];

        for (let i = 0; i < k; i++) {
            found.push(list[Random.int(listLength)]);
        }

        return found;
    }
}
