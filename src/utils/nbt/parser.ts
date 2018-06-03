import { Token, TokenType } from './tokenizer'

/**
 * Provides methods to parse a NBT tokens list.
 *
 * @author SPGoding
 */
export class Parser {
    public parse(tokens: Token[]) {
        const result = this.parseCompound(tokens, 0)

        if (result.pos + 1 === tokens.length) {
            return result.value
        } else {
            throw `Unsymmetrical squares.`
        }
    }

    private parseCompound(tokens: Token[], pos: number): ParseResult {
        let expectedType: TokenType
        let state: 'key' | 'value' = 'key'

        expectedType = TokenType.BeginCompound

        for (; pos < tokens.length; pos++) {
            const token = tokens[pos]

            if (token.type === expectedType) {
                switch (token.type) {
                    case TokenType.BeginCompound:
                        expectedType = TokenType.EndCompound | TokenType.Key
                        break
                    case TokenType.Byte:
                    case TokenType.Double:
                    case TokenType.Float:
                    case TokenType.Int:
                    case TokenType.Long:
                    case TokenType.Short:
                    case TokenType.String:
                        if (state === 'key') {
                            expectedType = TokenType.Comma
                        } else if (state === 'value') {
                        }
                        break
                    case TokenType.Comma:
                        expectedType = TokenType.Value
                        break
                    default:
                        break
                }
            } else {
                throw `Expect '${expectedType}' but get '${
                    token.type
                }' when parsing '${tokens}[${pos}]'.`
            }
        }

        throw ''
    }
}

interface ParseResult {
    value: Value
    pos: number
}

type Value =
    | Compound
    | List
    | ByteArray
    | IntArray
    | LongArray
    | Byte
    | Short
    | Int
    | Long
    | Float
    | Double
    | String

class String {
    private value: string

    public get = () => this.value

    public toString = () => `"${this.value}"`
}

class Byte {
    private value: number

    public get = () => this.value

    public toString = () => `${this.value}b`
}

class Short {
    private value: number

    public get = () => this.value

    public toString = () => `${this.value}s`
}

class Int {
    private value: number

    public get = () => this.value

    public toString = () => `${this.value}`
}

class Long {
    private value: number

    public get = () => this.value

    public toString = () => `${this.value}L`
}

class Float {
    private value: number

    public get = () => this.value

    public toString = () => `${this.value}f`
}

class Double {
    private value: number

    public get = () => this.value

    public toString = () => `${this.value}d`
}

class Compound {
    private values: Map<string, Value>

    public get = (key: string) => this.values.get(key)

    public set(key: string, val: Value) {
        this.values.set(key, val)
    }

    public toString() {
        let result = '{'

        for (const key of this.values.keys()) {
            const val = this.get(key)
            if (val) {
                result += `${key}:${val.toString()},`
            }
        }

        result = result.slice(0, -1) + '}'
    }
}

class List {
    private values: Value[]

    public get = (index: number) => this.values[index]

    public toString() {
        let result = '['

        for (const val of this.values) {
            result += `${val.toString()},`
        }

        result = result.slice(0, -1) + ']'
    }
}

class ByteArray {
    private values: Byte[]

    public get = (index: number) => this.values[index]

    public toString() {
        let result = '[B;'

        for (const val of this.values) {
            result += `${val.toString()},`
        }

        result = result.slice(0, -1) + ']'
    }
}

class IntArray {
    private values: Int[]

    public get = (index: number) => this.values[index]

    public toString() {
        let result = '[I;'

        for (const val of this.values) {
            result += `${val.toString()},`
        }

        result = result.slice(0, -1) + ']'
    }
}

class LongArray {
    private values: Long[]

    public get = (index: number) => this.values[index]

    public toString() {
        let result = '[L;'

        for (const val of this.values) {
            result += `${val.toString()},`
        }

        result = result.slice(0, -1) + ']'
    }
}
