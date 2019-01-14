
class App extends React.Component {

prevId;

constructor(props){

  super(props);
  this.prevId = Math.floor(Math.random()*1000);
  this.state = {
    page: 1,
    isLoaded:  false,
    isLoading: true,
    scrolling: false,
    data: [],
  }
}
  componentWillMount = () => {
    this.loadData();

    //Watch the Scroll event
    window.addEventListener('scroll', (e) => {
      this.scrollHandeler(e)
    })
  }

  getAddId = () => {

    //Generate a unique id for Add
    let addNum = Math.floor(Math.random()*1000);
    if(addNum == this.prevId){
      addNum++;
    }
    console.log("Prev: "+this.prevId+ "Cur: "+ addNum);
    this.prevId = addNum;
    
    return addNum;
  }

  scrollHandeler = (e) => {
    const {data, page, scrolling, prevData } = this.state;
    if(scrolling) return
    let wrap = document.querySelector('#prodContainer');
    let wrapContentHeight = wrap.offsetHeight;
    let vertOffset = window.pageYOffset;
    let check  = vertOffset + window.innerHeight;
    //Identify if the user has scrolled enough to reach the bottom of screen then load more data
     if(check >= wrapContentHeight){
       
      console.log("Loading more data...");
      //Post an add
      wrap.innerHTML += '<img class="ad addStyles" src="/ads/?r=' + this.getAddId() + '"/>';
      this.loadmore();
      
     }
  }


  loadData = () => {

    const {data, page, scrolling} = this.state;
    console.log("Page: " + page);
    fetch('http://localhost:3000/products?_page='+page+'&_limit=20')
    .then(items => items.json())
    .then((json => {
      this.setState({
        isLoading: false,
        isLoaded: true,
        scrolling: false,
        data: [ ...data, ...json], //Append the new fetched data with the old one in the array
      })
    }));
  }

 loadmore = () => {
      this.setState(prevState => ({
        page: prevState.page + 1, //Increment to load next page's data
        scrolling:  true,
      }), this.loadData)
      
 }



  //Calculate the number of days
  getNOD(string){
    let currentDate = new Date();
    let itemDate = new Date(string);
    let NOD = Math.round(Math.abs(currentDate.getTime() - itemDate.getTime())/(24*60*60*1000))
    if(NOD > 7){
      return ""+itemDate.getDate() + "-"+ (itemDate.getMonth()+1) + "-"+itemDate.getFullYear();
    }else{
      return NOD + " Days ago.";
    }
    
  }

  render() {
    const checkIndex = 0;
    let {isLoading, data} = this.state;
    if(isLoading){
      return(
        <div>
          <img id='loadingIco'  src='Assets/loading.gif' width = "50" height = "50" />
          <h1 >Loading...</h1>
        </div>
      );
    }else{
     // console.log(data);
      return (
        <div id = "prodContainer" className=" cardContainerStyles container">
          
          {
            data.map(item =>  
             <div className = "card cardStyles " id = {item.id}>
                <div className = "card-block text-center "> 
                    <h1 className="card-title " style={{fontSize: item.size}}>{item.face}</h1>
                    <div className="detailsStyles">
                        <h4 >Price: ${Math.floor(item.price*0.01)}</h4>
                        <h4 >Size: {item.size}px</h4>
                        <p>Posted {this.getNOD(item.date)}</p>
                        <button className = "btn btn-primary">Add to Cart</button>
                    </div>
                </div>
            </div>
            
            ) 
            
          }
        
        
        </div>
           
      );
    }
    
  }
}
