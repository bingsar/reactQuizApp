//https://codepen.io/anon/pen/XawOJL?editors=1010 пример входа/выхода на сайте

const dataBook = [
    {id:1, title:"Book 1",author:"Author 1", price: 500},
    {id:5, title:"Book 2",author:"Author 2", price: 1200},
    {id:6, title:"Book 3",author:"Author 3", price: null}
];
function formatPrice(price) {
    return price ? <strong>{price}</strong> : <del>&nbsp;</del>;
}
/*function Book(props){
 const price = props.price ? <strong>{props.price}</strong> :<del>&nbsp;</del> ;
return <div className="book">
      <h3>{props.title}</h3>
      <img src={'http://placehold.it/100x120?text='+props.title} alt="" />
      <p>Автор: {props.author}</p>
      <p>Цена: {price}</p>
 </div>;
}*/
class Book extends React.Component{
    constructor(props){
        super(props);
        this.state = {selected: false};
        this.handleClick = this.handleClick.bind(this);
        this.addBasketBook = this.addBasketBook.bind(this);
    }
    handleClick(ev){
        ev.preventDefault();
        this.setState({selected: !this.state.selected});
    }

    addBasketBook(ev){
        ev.preventDefault();
        this.props.handleAddBasket(this.props.id);
    }
    componentDidMount() {
        console.log('--','компонент смонтирован')
    }
    render(){

        const price = this.props.price ? <strong>{this.props.price}</strong> :<del>&nbsp;</del> ;
        return <div className={"book "+(this.state.selected ? "book-selected" : "book-default")}>
            <h3>{this.props.title}</h3>
            <img src={'http://placehold.it/100x120?text='+this.props.title} alt="" />
            <p>Автор: {this.props.author}</p>
            <p>Цена: {price}</p>
            <a href="#" onClick={this.handleClick}>Сравнить</a>&nbsp;
            <a href="#" onClick={this.addBasketBook}>В корзину</a>
        </div>;
    }
}

class BookWithoutPrice extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        const price = this.props.price ? <strong>{this.props.price}</strong> :<del>&nbsp;</del> ;
        return <div className={"book book-default"}>
            <h3>{this.props.title}</h3>
            <img src={'http://placehold.it/100x120?text='+this.props.title} alt="" />
            <p>Автор: {this.props.author}</p>
            <p>Цена: {price}</p>
        </div>;
    }
}


class Welcome extends React.Component {
    constructor(props){
        super(props);
        console.log(props)
    }

    getDefaultProps(){
        return {
            name: "Гость",
            age: 25
        };
    }
    render(){
        return <h2>Hello, {this.props.name}. {this.props.age}</h2>;
    }
}
/*function Welcome(props) {
  return <h2>Hello, {props.name}. {props.age}</h2>;
}*/
class AddBookForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: '',
            title: '',
            author: '',
            price: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    isValidBook(book){
        return book.id && book.title && book.author && true;
    }
    handleSubmit(ev){
        ev.preventDefault();
        if(this.isValidBook(this.state)){
            //dataBook.push(this.state);
            this.props.onSubmit(this.state);
            this.setState({id: '',title: '', author: '',price: ''});
            //console.log(dataBook);
        } else alert("Заполните поля!")
    }
    handleChange(ev){
        this.setState({[ev.target.name]:ev.target.value});
        //console.log(this.state)
    }

    render(){
        return <form action="" onSubmit={this.handleSubmit} >
            <div>id <input type="text" name="id" onChange={this.handleChange} value={this.state.id} /></div>
            <div>Название <input type="text" name="title" onChange={this.handleChange} value={this.state.title}/></div>
            <div>Авторы <input type="text" name="author" onChange={this.handleChange}  value={this.state.author}/></div>
            <div>Цена <input type="text" name="price"  onChange={this.handleChange}  value={this.state.price}/></div>
            <div><input type="submit" value="Добавить" onChange={this.handleChange} /></div>
        </form>
    }
}




class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dataBook: dataBook,
            items: []
        };
        this.updateBooks = this.updateBooks.bind(this);
        this.addBasket = this.addBasket.bind(this);
        this.removeBasket = this.removeBasket.bind(this);
    }
    removeBasket(id){
        let items = this.state.items.slice(0),result = [];
        items[id] = undefined;
        this.setState({items:items});
    }
    addBasket(id){
        let items = this.state.items.slice(0);
        items[id] = id in items ? ++items[id] : 1;
        this.setState({items:items});
        console.log(items,id)
    }

    updateBooks(newBook){
        const tmp = this.state.dataBook;
        tmp.push(newBook);
        this.setState({dataBook: tmp});
    }
    render(){
        const books = dataBook.map(item => {
            return item.price ?
                <Book
                    id={item["id"]}
                    key={item["id"]}
                    title={item["title"]}
                    price={item["price"]}
                    author={item["author"]}
                    handleAddBasket={this.addBasket}
                />:
                <BookWithoutPrice title={item["title"]} price={item["price"]} author={item["author"]}/>
        });
        return <div>
            <Basket
                items={this.state.items}
                dataBook={this.state.dataBook}
                handleRemoveBasket={this.removeBasket}
            />
            <AddBookForm onSubmit={this.updateBooks} />
            {books}
        </div>;
    }
}
class Basket extends React.Component {
    constructor(props){
        super(props);
        this.deleteBasketItem = this.deleteBasketItem.bind(this);
    }
    deleteBasketItem(ev){
        ev.preventDefault();
        this.props.handleRemoveBasket(ev.target.id);
    }
    getIndexById(id){
        for(let p in this.props.dataBook)
            if (this.props.dataBook[p]['id'] == id)
                return p
    }
    render(){
        let items = [], j,sum = 0;

        for(let i in this.props.items){
            if(!this.props.items[i]) continue;
            j = this.getIndexById(i);
            sum += this.props.items[i] * this.props.dataBook[j]['price'];
            items.push(
                <div className='basket-item'>
                    <a href='#'>«{this.props.dataBook[j]['title']}»</a>
                    <span>{this.props.items[i]}шт.</span>
                    <span>{this.props.dataBook[j]['price']}руб.</span>
                    <a href='#' onClick={this.deleteBasketItem} id={i}>Удалить</a>
                </div>
            );
        }



        return <div className='basket'>
            <h3>Корзина</h3>
            {items}
            <div className="basket-item">
                <span>Всего <b>{sum}</b> руб.</span>
            </div>
        </div>
    }
}
ReactDOM.render(
    <App />,
    document.getElementById("root")
);

//https://codepen.io/gaearon/pen/amqdNA?editors=0010





class Like extends React.Component {
    constructor(props) {
        super(props);
        this.state = {likes: 0};
        this.likeClick = this.likeClick.bind(this);
    }

    likeClick(e) {
        e.preventDefault();
        this.setState(prevState => ({
            likes: prevState.likes+1
        }));
    }

    render() {
        return (
            <a href="#" className="like" onClick={this.likeClick}>
                ❤ Нравится {this.state.likes}
            </a>
        );
    }
}

ReactDOM.render(
    <Like />,
    document.getElementById('root2')
);
