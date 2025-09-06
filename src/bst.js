export default Tree

function NewNode(dataInput) {
    const nodeObj = {
        data: null || dataInput,
        leftChild: null,
        rightChild: null,
    }

    return nodeObj
}

function Tree(arrInput) {
    let root = buildTree()

    function getRootNode() {
        return root
    }

    function sortArr(arrInput) {
        //sort from small to big
        const sortedArr = arrInput.sort((a, b) => a - b) //a negative value means should come before b

        //remove duplicate
        const cleanArr = sortedArr.filter(
            (num, index, arr) => num !== arr[index - 1]
        )

        return cleanArr
    }

    function buildTree(arr = sortArr(arrInput)) {
        const rootNode = NewNode()
        if (!arr || arr.length === 0) {
            return rootNode
        }

        let midIndex =
            arr.length % 2 === 0
                ? Math.floor(arr.length / 2) - 1
                : Math.floor(arr.length / 2)
        let midNum = arr[midIndex]
        let leftIndex = midIndex - 1
        let rightIndex = midIndex + 1

        if (arr.length === 1) {
            rootNode.data = arr[0]
            rootNode.leftChild = null
            rootNode.rightChild = null
            return rootNode
        }
        if (leftIndex < 0) {
            rootNode.data = midNum
            rootNode.leftChild = null
            rootNode.rightChild = buildTree(arr.slice(rightIndex, arr.length))
            return rootNode
        }
        if (rightIndex > arr.length - 1) {
            rootNode.data = midNum
            rootNode.leftChild = buildTree(arr.slice(0, midIndex))
            rootNode.rightChild = null
            return rootNode
        }
        rootNode.data = midNum
        rootNode.leftChild = buildTree(arr.slice(0, midIndex))
        rootNode.rightChild = buildTree(arr.slice(rightIndex, arr.length))

        return rootNode
    }

    const prettyPrint = (node, prefix = '', isLeft = true) => {
        if (node === null) {
            return
        }
        if (node.rightChild !== null) {
            prettyPrint(
                node.rightChild,
                `${prefix}${isLeft ? '│   ' : '    '}`,
                false
            )
        }
        console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`)
        if (node.leftChild !== null) {
            prettyPrint(
                node.leftChild,
                `${prefix}${isLeft ? '    ' : '│   '}`,
                true
            )
        }
    }

    function insert(value) {
        //insert is always inserting as leaf node, transverse through nodes from root
        const insertedValue = value
        const rootNode = getRootNode()

        //if root node is empty with data
        if (rootNode.data === null) {
            rootNode.data = insertedValue
            return
        }

        //start transversing down the tree from root node
        let currentNode = rootNode

        while (currentNode !== null) {
            //first case, value already exist
            if (currentNode.data === insertedValue) {
                return
            } else if (currentNode.data > insertedValue) {
                if (currentNode.leftChild === null) {
                    currentNode.leftChild = NewNode(value)
                    break
                } else {
                    currentNode = currentNode.leftChild
                }
            } else if (currentNode.data < insertedValue) {
                if (currentNode.rightChild === null) {
                    currentNode.rightChild = NewNode(value)
                    break
                } else {
                    currentNode = currentNode.rightChild
                }
            }
        }
    }

    function deleteItem(value) {
        const deleteValue = value
        const rootNode = getRootNode()

        if (rootNode.data === null) {
            throw new Error('Tree is empty')
        }

        //three cases of delete
        //first case is deleting a node with no child
        //second case is deleting a node with one side child
        //third case is deleting a node with both child
        let currentNode = rootNode
        let previousNode

        while (currentNode !== null) {
            if (currentNode.data === deleteValue) {
                //first case: node with no child
                if (
                    currentNode.leftChild === null &&
                    currentNode.rightChild === null
                ) {
                    if (previousNode === undefined) {
                        root = NewNode()
                    } else if (previousNode.leftChild === currentNode) {
                        previousNode.leftChild = null
                    } else if (previousNode.rightChild === currentNode) {
                        previousNode.rightChild = null
                    }
                    break
                } //second case
                else if (
                    currentNode.leftChild === null ||
                    currentNode.rightChild === null
                ) {
                    if (previousNode.leftChild === currentNode) {
                        if (currentNode.leftChild !== null) {
                            previousNode.leftChild = currentNode.leftChild
                        } else {
                            previousNode.leftChild = currentNode.rightChild
                        }
                    } else {
                        if (currentNode.leftChild !== null) {
                            previousNode.rightChild = currentNode.leftChild
                        } else {
                            previousNode.rightChild = currentNode.rightChild
                        }
                    } //third case
                    break
                } else if (
                    currentNode.leftChild !== null &&
                    currentNode.rightChild !== null
                ) {
                    let tempCurrent = currentNode
                    let tempNext = currentNode.rightChild
                    //first find the next bigger node (with no left child) by transversing
                    while (tempNext.leftChild !== null) {
                        tempCurrent = tempNext
                        tempNext = tempNext.leftChild
                    }
                    currentNode.data = tempNext.data //replace node data
                    //there can be a case where the next bigger node is the immediate right child
                    if (tempCurrent.rightChild === tempNext) {
                        if (tempNext.rightChild !== null) {
                            tempCurrent.rightChild = tempNext.rightChild
                        }
                    } //there could be right subtrees attaching to the node with value used for replacement
                    else if (tempNext.rightChild !== null) {
                        tempCurrent.leftChild = tempNext.rightChild
                    } else {
                        tempCurrent.leftChild = null
                    }
                }
                break
                //if current node data does not equal value, keep transversing
            } else {
                previousNode = currentNode
                if (currentNode.data > value) {
                    currentNode = currentNode.leftChild
                } else {
                    currentNode = currentNode.rightChild
                }
            }
        }
    }

    function find(value) {
        const rootNode = getRootNode()
        const findValue = value

        //tranverse to find the node with the same value
        if (rootNode.data === null) {
            throw new Error('Tree is empty')
        } else {
            let currentNode = rootNode
            while (currentNode.data !== findValue && currentNode !== null) {
                if (findValue < currentNode.data) {
                    currentNode = currentNode.leftChild
                } else {
                    currentNode = currentNode.rightChild
                }
                if (currentNode === null) {
                    return null
                }
            }
            if (currentNode.data === findValue) {
                return currentNode
            }
        }
    }

    //iterative implementation
    function levelOrderForEach(callback) {
        if (!callback) {
            throw new Error('Callback is required')
        } else {
            let currentNode = getRootNode()
            let queue = []
            queue.push(currentNode)
            while (queue.length > 0 && stopLoop !== true) {
                callback(queue[0])
                if (currentNode.leftChild !== null) {
                    queue.push(currentNode.leftChild)
                }
                if (currentNode.rightChild !== null) {
                    queue.push(currentNode.rightChild)
                }
                if (stopLoop === true) {
                    return callback(queue[0])
                }
                queue.shift()
                currentNode = queue[0]
            }
        }
    }

    //Inorder is left root right
    function inOrderForEach(callback, rootNode = getRootNode()) {
        if (rootNode === null) {
            return
        }
        inOrderForEach(callback, rootNode.leftChild)
        callback(rootNode)
        inOrderForEach(callback, rootNode.rightChild)
    }

    //Preorder is root left right
    function preOrderForEach(callback, rootNode = getRootNode()) {
        if (rootNode === null) {
            return
        }
        callback(rootNode)
        preOrderForEach(callback, rootNode.leftChild)
        preOrderForEach(callback, rootNode.rightChild)
    }

    //Postorder is left right root
    function postOrderForEach(callback, rootNode = getRootNode()) {
        if (rootNode === null) {
            return
        }
        postOrderForEach(callback, rootNode.leftChild)
        postOrderForEach(callback, rootNode.rightChild)
        callback(rootNode)
    }

    function height(value) {
        const node = find(value)
        if (!node) {
            return null
        }
        let currentNode = node
        let currentNodeLevel = 0
        let childNodeLevel = currentNodeLevel

        let levelsArr = []
        levelsArr.push([currentNode])
        while (levelsArr.length > 0) {
            if (currentNode.leftChild !== null) {
                if (!levelsArr[1]) {
                    levelsArr.push([])
                }
                levelsArr[1].push(currentNode.leftChild)
            }
            if (currentNode.rightChild !== null) {
                if (!levelsArr[1]) {
                    levelsArr.push([])
                }
                levelsArr[1].push(currentNode.rightChild)
            }

            levelsArr[0].shift()
            if (levelsArr[0].length === 0) {
                levelsArr.shift()
                if (levelsArr[0]) {
                    childNodeLevel += 1
                }
            }
            if (levelsArr[0]) {
                currentNode = levelsArr[0][0]
            }
        }
        return childNodeLevel
    }

    function depth(value) {
        const rootNode = getRootNode()
        const findValue = value
        let level = 0
        //transverse to find the node with the same value
        if (rootNode.data === null) {
            throw new Error('Tree is empty')
        }
        if (value === rootNode.data) {
            return level
        } else {
            let currentNode = rootNode
            while (currentNode.data !== findValue && currentNode !== null) {
                if (findValue < currentNode.data) {
                    currentNode = currentNode.leftChild
                    level += 1
                } else {
                    currentNode = currentNode.rightChild
                    level += 1
                }
                if (currentNode === null) {
                    return null
                }
            }
            if (currentNode.data === findValue) {
                return level
            }
        }
    }

    //helper callback function for isBalanced
    //add stopLoop variable as a flag for levelOrderForEach
    let stopLoop = false
    function checkLeftRight(node) {
        let leftSubtree = node.leftChild
        let rightSubtree = node.rightChild

        let leftSubtreeHeight =
            leftSubtree === null ? 0 : height(leftSubtree.data)
        let rightSubtreeHeight =
            rightSubtree === null ? 0 : height(rightSubtree.data)

        const heightDiff = Math.abs(leftSubtreeHeight - rightSubtreeHeight)

        if (heightDiff > 1) {
            stopLoop = true
            return false
        }
    }

    function isBalanced() {
        if (levelOrderForEach(checkLeftRight) === false) {
            stopLoop = false
            return false
        } else {
            stopLoop = false
            return true
        }
    }

    function rebalance() {
        let newArray = []
        //helper callback for rebalance
        function treeToArray(node) {
            if (node !== null) {
                newArray.push(node.data)
            }
        }
        levelOrderForEach(treeToArray)
        console.log(newArray)
        const newSortedArr = sortArr(newArray)
        root = buildTree(newSortedArr)
    }

    return {
        getRootNode,
        insert,
        deleteItem,
        prettyPrint,
        find,
        levelOrderForEach,
        inOrderForEach,
        preOrderForEach,
        postOrderForEach,
        height,
        depth,
        isBalanced,
        rebalance,
    }
}
