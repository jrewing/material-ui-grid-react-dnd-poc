import React, {useRef, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ItemTypes } from './ItemTypes';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { useDrag, useDrop } from 'react-dnd'


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        background: '#2299aa',
        elevation: 3,
        classes: 'petter',
    },
}));

export const ElementThing = (props) => {
    const ref = useRef(null);

    const [, drop] = useDrop({
        accept: ItemTypes.ElementThing,
        hover(item, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index;
            const dragRowId = item.rowId;
            const hoverIndex = props.index;
            const hoverRowId = props.rowId;
            // Don't replace items with themselves
            if (dragIndex === hoverIndex && item.rowId === props.rowId) {
                return
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()

            // Determine mouse position
            const clientOffset = monitor.getClientOffset()
            // Get pixels to the top

            if (clientOffset.x < hoverBoundingRect.right && clientOffset.x > hoverBoundingRect.left && clientOffset.y < hoverBoundingRect.bottom && clientOffset.y > hoverBoundingRect.top) {
                // Time to actually perform the action
                console.log(dragRowId);
                props.moveElementThing(dragIndex, hoverIndex, dragRowId, hoverRowId);
                //props.cleanUp(dragIndex, hoverIndex, dragRowId, hoverRowId);
                // Note: we're mutating the monitor item here!
                // Generally it's better to avoid mutations,
                // but it's good here for the sake of performance
                // to avoid expensive index searches.
                console.log(hoverIndex);
                console.log(item.index);
                item.index = hoverIndex;
                item.rowId = props.rowId;
            }
        },
    });
    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.ElementThing, elmId: props.id, index: props.index, rowId: props.rowId },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const [elementThing, setElementThing] = useState();
    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));
    const classes = useStyles();
    const getColors = (cells) => {
        const sizeMap = {
            '4': { xs: 4, sm: 4},
            '6': { xs: 6, sm: 6},
            '12': { xs: 12, sm: 0},
        };
        return sizeMap[cells];
    }
    console.log('props.showPlaceHolder', props.showPlaceHolder);
    const placeHolderClassName = (props.placeHolder) ? 'placeHolder' : '';
    const showPlaceHolderClassName = (props.showPlaceHolder) ? 'showPlaceHolder' : '';
    const classNames = `${classes.paper} rowId_${props.rowId} ${placeHolderClassName} ${showPlaceHolderClassName}`;

    return (
            <Grid item xs={props.xs} sm={props.sm}>
                <Paper style={{opacity: opacity, background: `#aa${props.sm}${props.xs}`}} ref={ref} className={classNames} >PlaceHolder={props.placeHolder.toString()} xs={props.xs} sm={props.sm} elmId={props.elmId} index={props.index}</Paper>
            </Grid>
        );
};
