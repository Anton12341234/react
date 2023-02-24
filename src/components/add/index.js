import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import './Add.scss';
import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {origUrl,history} from '../../App.js';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {useDropzone} from 'react-dropzone';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors, useDroppable
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, rectSortingStrategy, SortableContext, useSortable, horizontalListSortingStrategy  } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {arrayMoveImmutable} from 'array-move';
import {connect} from 'react-redux';
import {actionUpload,actioCreateAd,bd_Url} from '../../actions';


const SortableItem = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.id });

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };
    
    const Render = props.render

  return (
    <div style={itemStyle} ref={setNodeRef} {...attributes} {...listeners}>
      <Render {...{[props.itemProp]:props.item}}/>
    </div>
  );
};

const Droppable = ({ id, items, itemProp, keyField, render }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <SortableContext id={id} items={items} strategy={rectSortingStrategy}>
        {items.map((item) => (
          <SortableItem render={render} key={item[keyField]} id={item} 
                        itemProp={itemProp} item={item}/>
        ))}
    </SortableContext>
  );
};

function Dnd({items:startItems,render, itemProp, keyField, onChange, horizontal}) {
  const [items, setItems] = useState(
      startItems
  );
  useEffect(() => setItems(startItems), [startItems])

  useEffect(() => {
      if (typeof onChange === 'function'){
          onChange(items)
      }
  },[items])

  const sensors = useSensors(
      useSensor(PointerSensor,  { activationConstraint: { distance: 5 } }),
      useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates
      })
  );

  const handleDragEnd = ({ active, over }) => {
      const activeIndex = active.data.current.sortable.index;
      const overIndex = over.data.current?.sortable.index || 0;

      setItems((items) => {
          return arrayMoveImmutable( items, activeIndex, overIndex)
      });
  }

  const containerStyle = { 
    display: horizontal ? "flex" : '',
    flexWrap: "wrap",
    marginBottom: "30px",
    justifyContent: "center",
  };

return (
  <DndContext
    sensors={sensors}
    onDragEnd={handleDragEnd}
  >
    <div style={containerStyle}>
        <Droppable id="aaa" 
                   items={items} 
                   itemProp={itemProp} 
                   keyField={keyField} 
                   render={render}/>
    </div>
  </DndContext>
);
}


const ImgBox = ({image, onDelete})=>{
  const useStyles = makeStyles((theme) => ({
    img:{
      borderRadius: "8px",
      width: '100%',
      height: '100%',
      margin: '5px',
      maxWidth: '200px',
    }
  }));
  const classes = useStyles();

  return(<>
        {image!== undefined && <img className={classes.img} src={bd_Url+image.url} onClick={() => onDelete(image)}/>}
        </>
  )
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '50vh',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input:{
    marginBottom: '3%'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


  
function CreateAd({action, newImg}) {
  const classes = useStyles()
  const dispatch = useDispatch();
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  const [createAd, setCreateAd] = useState({ title:'', description:'', price:0});
  const [create, setCreate] = useState('');

  useEffect(() => {
    if(newImg){
      if(newImg._id){
        if(createAd.images){
          setCreateAd({...createAd,images: [...createAd.images, newImg]})
        }else{
          setCreateAd({...createAd,images: [newImg]})
        }
      }
    }
  }, [newImg]);
  
  useEffect(() => {
    setCreateAd({images:[], title:'', description:'', price:0})
  },[])

  useEffect(() => {
    acceptedFiles.map(file =>action(file));
  }, [acceptedFiles]);



  const deleteImage     = image => setCreateAd({...createAd, images: createAd.images.filter(i => i !== image)})
  const localPostImage  = ({image}) => <ImgBox image={image} 
                                                   onDelete={imgToDelete => deleteImage(imgToDelete)}/>

  const onclickCreate = ()=>{
    if(create.images.length>0){
      let arrIdImg = create.images.map((el)=> el={_id:el._id, url:el.url})
      dispatch(actioCreateAd({...createAd,images: arrIdImg, tags: ['']}))
    }else{
      dispatch(actioCreateAd({...createAd, tags: ['']}))
    }
    setCreateAd({ title:'', description:'', price:0})
    history.push("/page/1")
  }


  return (
    <main className="mainAdd">
      <div className="bannerAdd" >
          <div className="imd__flex__boxx">
            <Dnd items={createAd.images||[]} render={localPostImage} itemProp="image" keyField="_id"
                onChange={newArray=>setCreate({...createAd,images: newArray})}
                horizontal/>
          </div>
          <div className="conteiner">
            <div className="flex__boxx">
              <section className="containerSection">
                <div {...getRootProps({className: 'dropzone'})}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </section>
              <div className="textBox">
                  <TextField 
                  type='number'
                  value={createAd.price}
                  onChange={(e) => setCreateAd({...createAd, price: +(e.target.value)})}
                    className={classes.input} 
                    required id="standard-required" 
                    label="Price $" 
                    />
                  <TextField
                  value={createAd.title}
                  onChange={(e) => setCreateAd({...createAd, title: e.target.value})} 
                    className={classes.input} 
                    required id="standard-required" 
                    label="Title"  
                    />
                  <TextField 
                  value={createAd.description}
                  onChange={(e) => setCreateAd({...createAd, description: e.target.value})}
                    id="outlined-multiline-static"
                    label="Description"
                    multiline
                    rows={4}
                    variant="outlined"
                  />
                  <Button
                  onClick={onclickCreate}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  startIcon={<AddCircleIcon/>}
                  >
                  create ad
                  </Button>
              </div>
            </div>
          </div>
        </div>
    </main>
  );
}

const CreateAdConnect = connect(state => ({
  newImg: state.promise?.upload?.payload||[]}),
  {action: actionUpload} )(CreateAd)


export default CreateAdConnect