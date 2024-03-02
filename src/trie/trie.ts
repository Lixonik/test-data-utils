import { isNil, shuffleArray } from '../utils'
import { WORDS as RUS_WORDS } from '../rus/constants'

class TrieNode {
    children: Map<string, TrieNode>
    isEndOfWord: boolean
    isPrefix: boolean

    constructor() {
        this.children = new Map<string, TrieNode>()
        this.isEndOfWord = false
        this.isPrefix = false
    }
}

export class Trie {
    private readonly root: TrieNode

    constructor() {
        this.root = new TrieNode()
    }

    insert(word: string) {
        this.insertAfterNode(this.root, word)
    }

    insertDictionary(prefixes: string[], roots: string[], suffixes: string[]) {
        this.insertAllIntoOrigin(prefixes, true)
        this.insertAllIntoTails(roots)
        this.insertAllIntoTails(suffixes)
    }

    private insertAllIntoOrigin(words: string[], isPrefix?: boolean) {
        this.insertAllAfterNode(this.root, words, isPrefix)
    }


    private insertAllIntoTails(words: string[]) {
        const tails = this.findTails()

        tails.forEach(tail => this.insertAllAfterNode(tail, words))
    }

    search(word: string): boolean {
        let current = this.root
        for (let i = 0; i < word.length; i++) {
            let ch = word.charAt(i)
            let node = current.children.get(ch)
            if (isNil(node)) {
                return false
            }
            current = node
        }

        return current.isEndOfWord
    }

    delete(word: string): boolean {
        return this.deleteRecursive(this.root, word, 0)
    }

    getRandomFullString(length: number, separator?: string): string {
        const wordsArray: string[] = []
        let lengthOfUpdatedWordsArray: number = 0
        separator ??= ''

        const traverseTrie = (node: TrieNode, prefix: string) => {
            lengthOfUpdatedWordsArray = [...wordsArray, prefix].join(separator).length

            if (node.isEndOfWord && lengthOfUpdatedWordsArray <= length) {

                let lastElement = wordsArray.at(-1) ?? '666'
                if (prefix.includes(lastElement)) {
                    return
                }

                if (!node.isPrefix) {
                    wordsArray.push(prefix)
                    console.log(wordsArray)
                }


                if (isNil(node.children)) {
                    console.log(node.children)
                    return
                }

            }

            //if (node.isEndOfWord && lengthOfUpdatedWordsArray <= length) {
            //    //console.log([...wordsArray, prefix])
            //    if (!prefix.indexOf(wordsArray[wordsArray.length - 1]) || wordsArray.length === 0) {
            //        wordsArray.push(prefix)
            //    }
            //
            //    if (isNil(node.children)) return
            //    //const shuffledChildren = shuffleArray(Array.from(node.children.entries()))
            //
            //    Array.from(node.children.entries()).forEach(([char, child]) => traverseTrie(child, prefix + char))
            //
            //    //if (isNil(node.children)) {
            //    //    traverseTrie(node.)
            //    //}
            //
            //    //traverseTrie(node, prefix+node.children)
            //}
            const shuffledChildren = shuffleArray(Array.from(node.children.entries()))

            shuffledChildren.forEach(([char, child]) => traverseTrie(child, prefix + char))

        }

            traverseTrie(this.root, '')
        //while (wordsArray.length === 0) {
        //    console.log('recursion')
        //}

        const fullString = wordsArray.join(separator)
        const lengthDiff = length - fullString.length

        return lengthDiff === 0
            ? fullString
            // 2nd level of recursion
            : `${fullString}${separator}${this.getRandomFullString(lengthDiff, separator)}`
    }

    private insertAfterNode(root: TrieNode, word: string, isPrefix?: boolean) {
        let current = root
        for (let i = 0; i < word.length; i++) {
            let ch = word.charAt(i)
            let node = current.children.get(ch)
            if (isNil(node)) {
                node = new TrieNode()
                current.children.set(ch, node)
            }
            current = node
        }
        current.isEndOfWord = true
        current.isPrefix = isPrefix ?? false
    }

    private insertAllAfterNode(root: TrieNode, words: string[], isPrefix?: boolean) {
        words.forEach(word => this.insertAfterNode(root, word, isPrefix ?? false))
    }

    private deleteRecursive(current: TrieNode, word: string, index: number): boolean {
        if (index === word.length) {
            if (!current.isEndOfWord) {
                return false
            }
            current.isEndOfWord = false
            return current.children.size === 0
        }
        let ch = word.charAt(index)
        let node = current.children.get(ch)
        if (isNil(node)) {
            return false
        }
        let shouldDeleteCurrentNode = this.deleteRecursive(node, word, index + 1)

        if (shouldDeleteCurrentNode) {
            current.children.delete(ch)
            return current.children.size === 0
        }
        return false
    }

    private findTails(): TrieNode[] {
        let tails: TrieNode[] = []
        this.findTailsRecursive(this.root, tails)

        return tails
    }

    private findTailsRecursive(node: TrieNode, tails: TrieNode[]) {
        if (node.isEndOfWord) {
            tails.push(node)
        }
        for (let child of node.children.values()) {
            this.findTailsRecursive(child, tails)
        }
    }
}

