import { memo, useState, useCallback, useEffect } from "react";
import classnames from "classnames";

import { Input } from "./input";

import { TOGGLE_ITEM, REMOVE_ITEM, UPDATE_ITEM } from "../constants";

export const Item = memo(function Item({ todo, dispatch, index, isNew }) {
    const [isWritable, setIsWritable] = useState(false);
    const { title, completed, id } = todo;

    // add a couple of columns to capture the time the item was added and completed
    const [addedTime, setAddedTime] = useState(new Date().toLocaleTimeString());
    const [completedTime, setCompletedTime] = useState("");

    useEffect(() => {
        if(completed && !completedTime) {
            setCompletedTime(new Date().toLocaleTimeString());
        }
    },[completed, completedTime]);

    const toggleItem = useCallback(() => dispatch({ type: TOGGLE_ITEM, payload: { id } }), [dispatch, id]);
    const removeItem = useCallback(() => dispatch({ type: REMOVE_ITEM, payload: { id } }), [dispatch, id]);
    const updateItem = useCallback((id, title) => dispatch({ type: UPDATE_ITEM, payload: { id, title } }), [dispatch]);

    const handleDoubleClick = useCallback(() => {
        setIsWritable(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsWritable(false);
    }, []);

    const handleUpdate = useCallback(
        (title) => {
            if (title.length === 0)
                removeItem(id);
            else
                updateItem(id, title);

            setIsWritable(false);
        },
        [id, removeItem, updateItem]
    );

    // first and second conditon to add new activity and change their colors based on the order they are ticked
    useEffect(() => {
        if (isNew) {
            handleAddNewActivity();
        }
    }, [isNew]);

    const handleAddNewActivity = useCallback(() => {
        const newItem = document.getElementById(`todo-item-${id}`);
        newItem.classList.add("new-activity");
        setTimeout(() => {
            newItem.classList.remove("new-activity");
        }, 15000);
    }, [id]);

    useEffect(() => {
        if (completed) {
            const completedItems = document.querySelectorAll('.completed');
            completedItems.forEach((item, idx) => {
                item.classList.remove('completed-yellow', 'completed-magenta', 'completed-green');
                if (idx === completedItems.length - 3) {
                    item.classList.add('completed-yellow');
                } else if (idx === completedItems.length - 2) {
                    item.classList.add('completed-magenta');
                } else if (idx === completedItems.length - 1) {
                    item.classList.add('completed-green');
                }
            });
        }
    }, [completed]);

    return (
        <li className={classnames({ completed: completed })} id={`todo-item-${id}`} data-testid="todo-item">
            <div className="view">
                {isWritable ? (
                    <Input onSubmit={handleUpdate} label="Edit Todo Input" defaultValue={title} onBlur={handleBlur} />
                ) : (
                    <>
                        <input className="toggle" type="checkbox" data-testid="todo-item-toggle" checked={completed} onChange={toggleItem} />
                        <label data-testid="todo-item-label" onDoubleClick={handleDoubleClick}>
                            {title}
                        </label>
                        <button className="destroy" data-testid="todo-item-button" onClick={removeItem} />
                    </>
                )}
            </div>
            <div>
                <span>Added: {addedTime}</span>
            </div>
            <div>
                <span>Completed: {completed ? completedTime : ""}</span>
            </div>
        </li>
    );
});
