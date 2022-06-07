import React, { useEffect, useState, useReducer } from 'react';
import { Helmet } from "react-helmet";
import { Label, Table, Segment, Modal, Header, Form, TextArea, Dropdown, Button, Icon, Divider, Checkbox, Search } from 'semantic-ui-react';
import _ from 'lodash';
import 'semantic-ui-css/semantic.min.css'
import './App.css';

interface searchBoxRep { index: number, title: string, description: string, tags: Array<string>, taskStatus: string };
interface taskRowRep { index: number, name: string, desc: string, tags: Array<string>, taskStatus: string }
const statuses = [{ key: "Not Started", text: "Not Started", value: "Not Started" },
{ key: "In Progress", text: "In Progress", value: "In Progress" },
{ key: "Completed", text: "Completed", value: "Completed" }];

const TagDropDown = (props: { tagSet: Array<string>, onChange: any, currentTags: Array<string> }) => {
  let initOptions: Array<{ key: string, text: string, value: string }> = [];
  props.tagSet.forEach(tag => {
    initOptions.push({ key: tag, text: tag, value: tag });
  });

  const [options, setOptions] = useState(initOptions);

  const handleAddition = (e: {}, { value }: any) => {
    console.log("hello", options);
    setOptions([{ key: value, text: value, value: value }, ...options]);
  }
  const handleChange = (e: {}, { value }: any) => { props.onChange(value); }
  return (
    <Dropdown
      options={options}
      value={props.currentTags}
      placeholder='Select Tag'
      search
      selection
      fluid
      multiple
      allowAdditions
      onAddItem={handleAddition}
      onChange={handleChange}
    />
  );
}

const TaskRow = (props: { taskInfo: taskRowRep, tagSet: Array<string> }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>(props.taskInfo.name);
  const [taskDesc, setTaskDesc] = useState<string>(props.taskInfo.desc);
  const [tags, setTags] = useState<Array<string>>(props.taskInfo.tags);
  const [taskStatus, setTaskStatus] = useState<string>(props.taskInfo.taskStatus);
  const handleTagsChange = (tags: Array<string>) => { setTags(tags); }
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Table.Row key={props.taskInfo.index}>
          <Table.Cell>{props.taskInfo.name}</Table.Cell>
          <Table.Cell>{props.taskInfo.desc}</Table.Cell>
          <Table.Cell>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {props.taskInfo.tags.map((tag) =>
                <div style={{ padding: 2 }}>
                  <Label color="blue" tag>{tag}</Label>
                </div>
              )}
            </div>
          </Table.Cell>
          <Table.Cell>
            {
              (props.taskInfo.taskStatus === 'Not Started') ?
                <Label color="red">{props.taskInfo.taskStatus}</Label>
                : (props.taskInfo.taskStatus === 'In Progress') ?
                  <Label color="orange">{props.taskInfo.taskStatus}</Label>
                  :
                  <Label color="green">{props.taskInfo.taskStatus}</Label>
            }
          </Table.Cell>
        </Table.Row>
      }
    >
      <Modal.Header>Edit Task</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>Editing Task: {props.taskInfo.name}</Header>
          <Form>
            <Form.Field>
              <label>Task Name</label>
              <input placeholder="Task Name" defaultValue={taskName} onChange={(e: any) => setTaskName(e.target.value)} />
            </Form.Field>
            <Form.Field>
              <label>Task Description</label>
              <TextArea placeholder='Task Description' defaultValue={taskDesc} onChange={(e: any) => setTaskDesc(e.target.value)} />
            </Form.Field>
            <Form.Field>
              <label>Tags</label>
              <TagDropDown tagSet={props.tagSet} currentTags={tags} onChange={handleTagsChange} />
            </Form.Field>
            <Form.Field>
              <label>Task Status</label>
              <Dropdown
                placeholder='Select Friend'
                fluid
                selection
                options={statuses}
                defaultValue={taskStatus}
                onChange={(e: {}, { value }: any) => { setTaskStatus(value) }}
              />
            </Form.Field>
          </Form>

        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='green'>
          <Icon name='checkmark' /> Save
        </Button>
        <Button negative onClick={() => {
          setOpen(false);
          setTaskName(props.taskInfo.name);
          setTaskDesc(props.taskInfo.desc);
          setTags(props.taskInfo.tags);
          setTaskStatus(props.taskInfo.taskStatus);
        }}>Cancel</Button>

      </Modal.Actions>
    </Modal>);
}

function SearchBox(props: { source: Array<searchBoxRep>, searchInDesc: boolean , updateValue: any}) {
  const initialState = {
    loading: false,
    results: [],
    value: '',
  }
  function SearchBoxReducer(state: any, action: any) {
    switch (action.type) {
      case 'CLEAN_QUERY':
        return initialState
      case 'START_SEARCH':
        return { ...state, loading: true, value: action.query }
      case 'FINISH_SEARCH':
        return { ...state, loading: false, results: action.results }
      case 'UPDATE_SELECTION':
        return { ...state, value: action.selection }

      default:
        throw new Error()
    }
  }
  const [state, dispatch] = useReducer(SearchBoxReducer, initialState)
  const { loading, results, value } = state

  // Update results while typing
  const timeoutRef = React.useRef(0)
  const handleSearchChange = React.useCallback((e: any, data: any) => {
    clearTimeout(timeoutRef.current)
    dispatch({ type: 'START_SEARCH', query: data.value })

    timeoutRef.current = window.setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: 'CLEAN_QUERY' })
        return
      }

      const re = new RegExp(_.escapeRegExp(data.value), 'i');
      const isMatch = !props.searchInDesc ? (result: any) => re.test(result.title) : (result: any) => re.test(result.title) || re.test(result.description);
      dispatch({
        type: 'FINISH_SEARCH',
        results: _.filter(props.source, isMatch),
      })
    }, 300)
  }, [props.source, props.searchInDesc])
  useEffect(() => {
    dispatch({ type: 'FINISH_SEARCH', results: props.source })
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [props.source])

  useEffect(() => {props.updateValue(value)}, [value, props]);

  return (
    <Search
      fluid
      size='large'
      loading={loading}
      placeholder='Search...'
      onResultSelect={(e, data) => {
        dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title });
      }}
      onSearchChange={handleSearchChange}
      results={results}
      value={value}
    />

  )
}

const TaskTable = () => {
  const [tagSet, setTagSet] = useState<Array<string>>(new Array<string>());

  // Main Table States: Sorting Column, Table Data, Sorting Direction
  function sortReducer(state: any, action: any) {
    switch (action.type) {
      case 'RESET':
        return initTable(action.payload);
      case 'CHANGE_SORT':
        if (state.column === action.column) {
          return {
            ...state,
            data: state.data.slice().reverse(),
            direction:
              state.direction === 'ascending' ? 'descending' : 'ascending',
          }
        }

        return {
          column: action.column,
          data: _.sortBy(state.data, [action.column]),
          direction: 'ascending',
        }
      default:
        throw new Error()
    }
  }
  const initTable = (newdata: Array<taskRowRep>) => {
    return { column: null, data: newdata, direction: null };
  }
  const [backupData, setBackupData] = useState<Array<taskRowRep>>(new Array<taskRowRep>());
  const [state, dispatch] = useReducer(sortReducer, [], initTable); // here state = {column, data, dir}
  const { column, data, direction } = state;

  // Searching States
  const [searchData, setSearchData] = useState<Array<searchBoxRep>>([]);
  const [searchTagOptions, setSearchTagOptions] = useState<Array<{ key: string, text: string, value: string }>>([]);
  const [searchField, setSearchField] = useState<string>("");
  const [searchInDesc, setSearchInDesc] = useState<boolean>(false);
  const [searchTags, setSearchTags] = useState<Array<string>>([]);
  const [searchStatus, setSearchStatus] = useState<string>("");

  // Initial Set-Up, to replace with backend query
  useEffect(() => {
    let initTasks: Array<taskRowRep> = [
      { index: 1, name: 'Learn HTML', desc: "Create at least something", tags: ['Task 1.1', 'Task 1.2', "Brandon", "Hello", "hello"], taskStatus: "Not Started" },
      { index: 2, name: 'Learn CSS', desc: "Create at least a stylesheet", tags: ['Task 2.1', 'Task 2.2'], taskStatus: "In Progress" },
      { index: 3, name: 'Learn JAVASCRIPT', desc: "Create at least an APP", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
      { index: 4, name: 'Learn C++', desc: "Create at least a programme", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
      { index: 5, name: 'Learn Python', desc: "Create at least an AI", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
      { index: 6, name: 'Learn Haskell', desc: "Create at least a paper", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
      { index: 7, name: 'Learn C#', desc: "Create at least an game", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
    ];

    // Initialise States
    dispatch({ type: 'RESET', payload: initTasks });
    setBackupData(initTasks);
    // Convert to SearchBox format {index, title, description, tags, taskStatus}
    var initSearchData: Array<searchBoxRep> =
      initTasks.map((task) => { return { index: task.index, title: task.name, description: task.desc, tags: task.tags, taskStatus: task.taskStatus } });
    setSearchData(initSearchData);

    let initTagSet = new Array<string>();
    initTasks.forEach(task => {
      task.tags.forEach(tag => {
        initTagSet.push(tag);
      });
    });
    initTagSet = Array.from(new Set(initTagSet)); // Remove duplicates
    initTagSet.sort((a, b) => {                   // Sort alphabetically
      return (a.toLowerCase() > b.toLowerCase()) ? 1 : -1;
    });

    // Convert to Search Tag Dropdown Format {key, text, value}
    var initsearchTagOptions = new Array<{ key: string, text: string, value: string }>();
    initTagSet.forEach(tag => {
      initsearchTagOptions.push({ key: tag, text: tag, value: tag });
    });

    setSearchTagOptions(initsearchTagOptions);
    setTagSet(initTagSet);
  }, []);

  // ===== Handle Searching =====
  // Update Filters
  useEffect(() => {
    let newSearchOptions: Array<searchBoxRep> =
      backupData.map((task: taskRowRep) => { return { index: task.index, title: task.name, description: task.desc, tags: task.tags, taskStatus: task.taskStatus } });

    if (searchTags.length > 0) {
      newSearchOptions = newSearchOptions.filter(task => {
        return searchTags.every(tag => {
          return task.tags.includes(tag);
        });
      });
    }

    if (searchStatus !== "") {
      newSearchOptions = newSearchOptions.filter(task => {
        return task.taskStatus === searchStatus;
      });
    }
    setSearchData(newSearchOptions);
  }, [searchTags, searchStatus, backupData]);
  
  const handleSubmit = () => {
    console.log("search term", searchField);
    let newData = backupData;
    if (searchField !== "") {
      newData = newData.filter(task => {
        if (searchInDesc) {
          return (task.desc.toLowerCase().includes(searchField.toLowerCase()) || task.name.toLowerCase().includes(searchField.toLowerCase()));
        } else {
          return task.name.toLowerCase().includes(searchField.toLowerCase());
        }
      });
    }
    if (searchTags.length > 0) {
      newData = newData.filter(task => {
        return searchTags.every(tag => {
          return task.tags.includes(tag);
        });
      });
    }

    if (searchStatus !== "") {
      newData = newData.filter(task => {
        return task.taskStatus === searchStatus;
      });
    } 

    dispatch({ type: 'RESET', payload: newData });
  }


  return (
    <div>
      <Segment>

        <Form onSubmit={handleSubmit}>
          <Form.Group inline>

            <label>Search</label>
            <div style={{ width: "40em" }}>
              <SearchBox 
              key={JSON.stringify(searchData) + searchInDesc}
              source={searchData} 
              searchInDesc={searchInDesc}
              updateValue={setSearchField} />
            </div>

            <div>&nbsp;&nbsp;</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Form.Field  >
                <Checkbox label='Search in Descriptions' onChange={(e: any, d: any) => { setSearchInDesc(d.checked); }} />
              </Form.Field>
            </div>

            <label>Filters</label>
            <Dropdown
              placeholder='Select Tags'
              fluid
              multiple
              search
              selection
              onChange={(e: {}, { value }: any) => { setSearchTags(value); }}
              options={searchTagOptions}
            />
            <div>&nbsp;&nbsp;</div>
            <Dropdown
              placeholder='Select Status'
              clearable
              selection
              options={statuses}
              onChange={(e: {}, { value }: any) => { setSearchStatus(value); }}
            />
            <div>&nbsp;&nbsp;</div>
            <Form.Button content='Submit' />
          </Form.Group>
        </Form>
      </Segment>
      <Table celled selectable sortable fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === 'name' ? direction : null}
              onClick={() => {
                dispatch({ type: 'CHANGE_SORT', column: 'name' });
              }}
              key="name"
            >Task Name</Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'desc' ? direction : null}
              onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'desc' })}
              key="desc"
            >Task Description</Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'tags' ? direction : null}
              onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'tags' })}
              key="tags"
            >Tags</Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'taskStatus' ? direction : null}
              onClick={() => dispatch({ type: 'CHANGE_SORT', column: 'taskStatus' })}
              key="taskStatus"
            >Completed</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.map((rowData: taskRowRep) =>
            <TaskRow key={rowData.index} taskInfo={rowData} tagSet={tagSet}></TaskRow>
          )}
        </Table.Body>
      </Table>
    </div>

  );
}

const MainBodySegment = () => {
  return (
    <div className="mainBodySegment">
      <Segment>
        <div style={{ textAlign: 'center' }}>
          <h1>Brandon's "Modern" To-Do App</h1>
        </div>
        <Divider></Divider>
        <TaskTable />
      </Segment >
    </div >
  );
}

function App() {
  useEffect(() => {
    document.title = "Modern TODO App";
  });

  return (
    <div
      style={{
        padding: '3em',
      }} >
      <Helmet>
        <style>{"body { background-color: #eddefa; }"}</style>
      </Helmet>

      <MainBodySegment />
    </div >
  );
}

export default App;