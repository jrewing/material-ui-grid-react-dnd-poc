import React, {useState, useCallback} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {ElementThing} from './ElementThing';
import update from 'immutability-helper';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));


export default function FullWidthGrid() {
    {
        const [elementRows, setElementRows] = useState([
            {
                rowId: 1,
                cells: 1,
                elementThings: [{
                    elmId: 100,
                    xs: 12,
                    sm: 0,
                    rowId: 1,
                    placeHolder: true,
                },
                    {
                    elmId: 1,
                    xs: 12,
                    sm: 0,
                    rowId: 1,
                    placeHolder: false,
                },
                    ],
            },
            {
                rowId: 2,
                cells: 2,
                elementThings: [{
                    elmId: 2,
                    xs: 12,
                    sm: 6,
                    rowId: 2,
                    placeHolder: false,
                },
                {
                    elmId: 3,
                    xs: 12,
                    sm: 6,
                    rowId: 2,
                    placeHolder: false,
                 },
                ]
            },
            {
                rowId: 3,
                cells: 3,
                elementThings: [
                    {
                        elmId: 4,
                        xs: 4,
                        sm: 4,
                        rowId: 3,
                        placeHolder: false,
                    },
                    {
                        elmId: 5,
                        xs: 4,
                        sm: 4,
                        rowId: 3,
                        placeHolder: false,
                    },/*
                    {
                        elmId: 6,
                        xs: 4,
                        sm: 4,
                        rowId: 3,
                        placeHolder: false,
                    },*/
                ]
            },

        ]);

        const getElementSize = (cells) => {
            const sizeMap = {
                '3': { xs: 4, sm: 4},
                '2': { xs: 6, sm: 6},
                '1': { xs: 12, sm: 0},
            };
            return sizeMap[cells];
        };

        const classes = useStyles();
        const renderRowElement = (rowElement, index) => {
            console.log('renderRowElement', 'rowElement', rowElement);
            const showPlaceHolder = (rowElement.elementThings.length < 2) ? true : false;

            return <Grid container spacing={3} key={rowElement.rowId}>
                {rowElement.elementThings.map((elementThing, i) => renderElementThing(elementThing, i, showPlaceHolder))}
            </Grid>;
        };

        const renderElementThing = (elementThing, index, showPlaceHolder) => {
            return <ElementThing xs={elementThing.xs} sm={elementThing.sm} key={elementThing.elmId} showPlaceHolder={showPlaceHolder} placeHolder={elementThing.placeHolder} elmId={elementThing.elmId} rowId={elementThing.rowId}  index={index}
                                 moveElementThing={moveElementThing} />;
        };

        const moveElementThing = useCallback(
            (dragIndex, hoverIndex, dragRowId, hoverRowId) => {
                console.log('dragIndex', dragIndex);
                console.log('hoverIndex', hoverIndex);
                console.log('dragRowId', dragRowId);
                console.log('hoverRowId', hoverRowId);
                const dragElementThing = elementRows.find(r => r.rowId === dragRowId).elementThings[dragIndex];

                const dragRowIndex = elementRows.findIndex(r => r.rowId === dragRowId);
                const hoverRowIndex = elementRows.findIndex(r => r.rowId === hoverRowId);
                const hoverElementThing = elementRows.find(r => r.rowId === hoverRowId).elementThings[hoverIndex];
                if (hoverRowIndex < 0) {
                    return false;
                }
                console.log('dragRowIndex', dragRowIndex);
                console.log('hoverRowIndex', hoverRowIndex);
                let mutation = {};
                let mutatedElementThing = {...dragElementThing};
                // Is the row full?
                console.log(hoverElementThing.placeHolder);
                if (elementRows[hoverRowIndex].cells <= elementRows[hoverRowIndex].elementThings.length && !hoverElementThing.placeHolder) {
                    return false;
                }

                if (dragRowIndex === hoverRowIndex) {
                    setElementRows(
                        update(elementRows, {
                            [hoverRowIndex]: {
                                elementThings: {
                                    $splice: [
                                        [dragIndex, 1],
                                        [hoverIndex, 0, dragElementThing],
                                    ],
                                }
                            }
                        }),
                    );
                } else {
                    const size = getElementSize(elementRows[hoverRowIndex].cells);
                    mutatedElementThing.xs = size.xs;
                    mutatedElementThing.sm = size.sm;
                    /* I don´t know why I need to do this in two steps. Should be possible to do it in one update */
                    mutatedElementThing.rowId = hoverRowIndex + 1;
                    // remove from drag from row
                    mutation = update(elementRows,
                            {
                            [dragRowIndex]: {
                                elementThings: {
                                    $splice: [
                                        [dragIndex, 1],
                                    ],
                                }
                            }
                            });

                    mutation = update(mutation,
                        {
                            [hoverRowIndex]: {
                                elementThings: {
                                    $push: [mutatedElementThing],

                                }
                            }
                        });
                    /*
                    if (mutation[dragRowIndex].elementThings.length < 1) {
                        const placeHolderElementThing = {
                            elmId: 90,
                            xs: 12,
                            sm: 0,
                            rowId: 1 + dragRowIndex,
                            placeHolder: true,
                        };
                        mutation = update(mutation,
                            {
                                [dragRowIndex]: {
                                    elementThings: {
                                        $push: [placeHolderElementThing],
                                    }
                                }
                            });
                        console.log('after push placeholder row', mutation);
                    }*/
                    setElementRows(mutation);
                }
                console.log('move elementRows', elementRows);
                return true;
            },
            [elementRows, getElementSize],
        );



        return (
            <div className={classes.root}>
                {elementRows.map((rowElement, i) => renderRowElement(rowElement, i))}
            </div>
        );
    }
}

