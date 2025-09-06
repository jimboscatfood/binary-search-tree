import Tree from './bst' //entry file

// const array = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]
// const tree = Tree(array)
// tree.insert(997)
// tree.insert(998)
// tree.insert(999)
// tree.prettyPrint(tree.getRootNode())
// tree.deleteItem(997)
// tree.rebalance()
// tree.prettyPrint(tree.getRootNode())

function createRandomArr() {
    let randomArr = Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 100)
    )
    return randomArr
}

function driverFunction() {
    let initialArr = createRandomArr()
    console.log(initialArr)
    const bst = Tree(initialArr)
    console.log(bst.prettyPrint(bst.getRootNode()))
    console.log(bst.isBalanced())

    function getOrderArr(callback) {
        let array = []
        //helper callback
        function treeToArray(node) {
            if (node !== null) {
                array.push(node.data)
            }
        }
        callback(treeToArray)
        return array
    }

    let levelOrderArr = getOrderArr(bst.levelOrderForEach)
    let preOrderArr = getOrderArr(bst.preOrderForEach)
    let postOrderArr = getOrderArr(bst.postOrderForEach)
    let inOrderArr = getOrderArr(bst.inOrderForEach)

    //helper callback for rebalance

    console.log('Level Order:' + levelOrderArr.toString())
    console.log('Pre Order: ' + preOrderArr.toString())
    console.log('Post Order: ' + postOrderArr.toString())
    console.log('In Order: ' + inOrderArr.toString())

    for (let i = 0; i < Math.floor(Math.random() * 5 + 1); i++) {
        bst.insert(Math.floor(Math.random() * 100) + 100)
    }
    console.log(bst.prettyPrint(bst.getRootNode()))
    console.log(bst.isBalanced())

    bst.rebalance()
    console.log(bst.prettyPrint(bst.getRootNode()))
    console.log(bst.isBalanced())

    levelOrderArr = getOrderArr(bst.levelOrderForEach)
    preOrderArr = getOrderArr(bst.preOrderForEach)
    postOrderArr = getOrderArr(bst.postOrderForEach)
    inOrderArr = getOrderArr(bst.inOrderForEach)

    console.log('Level Order: ' + levelOrderArr.toString())
    console.log('Pre Order: ' + preOrderArr.toString())
    console.log('Post Order: ' + postOrderArr.toString())
    console.log('In Order: ' + inOrderArr.toString())
}

driverFunction()
