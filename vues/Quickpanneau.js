import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  FlatList,
  StyleSheet,
  Switch,
  Animated,
} from 'react-native';
import { Plus, MoreVertical, Check, ChevronUp } from 'lucide-react-native';

export default function QuickPanneau() {
  const [isOpen, setIsOpen] = useState(true);
  const [taskInput, setTaskInput] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskMenuId, setTaskMenuId] = useState(null);

  const handleAddTask = () => {
    if (!taskInput.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: taskInput, done: false }]);
    setTaskInput('');
  };

  const handleTaskChange = (id, newText) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, text: newText } : t)));
  };

  const toggleTaskDone = id => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const handleTaskDelete = id => {
    setTasks(tasks.filter(t => t.id !== id));
    setTaskMenuId(null);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={() => setIsOpen(!isOpen)} style={styles.toggleIconWrapper}>
        <ChevronUp
          size={28}
          style={[styles.chevronToggle, isOpen && styles.rotateDown]}
        />
      </Pressable>

      {isOpen && (
        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Tâches</Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Nouvelle tâche..."
              value={taskInput}
              onChangeText={setTaskInput}
              onSubmitEditing={handleAddTask}
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddTask}>
              <Plus size={18} color="white" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={tasks}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={[styles.itemRow, styles.taskRow]}>
                <Pressable onPress={() => toggleTaskDone(item.id)}>
                  <View style={styles.checkbox(item.done)} />
                </Pressable>

                {editingTaskId === item.id ? (
                  <TextInput
                    style={styles.taskInput}
                    value={item.text}
                    onChangeText={text => handleTaskChange(item.id, text)}
                    onSubmitEditing={() => setEditingTaskId(null)}
                  />
                ) : (
                  <Text style={[styles.taskText, item.done && styles.taskDone]}>
                    {item.text}
                  </Text>
                )}

                <View style={styles.taskMenu}>
                  {editingTaskId === item.id ? (
                    <TouchableOpacity onPress={() => setEditingTaskId(null)} style={styles.menuBtn}>
                      <Check size={18} color="white" />
                    </TouchableOpacity>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.menuBtn}
                        onPress={() =>
                          setTaskMenuId(taskMenuId === item.id ? null : item.id)
                        }
                      >
                        <MoreVertical size={18} color="white" />
                      </TouchableOpacity>
                      {taskMenuId === item.id && (
                        <View style={styles.dropdownMenu}>
                          <TouchableOpacity onPress={() => setEditingTaskId(item.id)}>
                            <Text>Modifier</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleTaskDelete(item.id)}>
                            <Text>Supprimer</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </>
                  )}
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  toggleIconWrapper: {
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronToggle: {
    color: '#10217f',
  },
  rotateDown: {
    transform: [{ rotate: '180deg' }],
  },
  panel: {
    width: '90%',
    maxWidth: 700,
    marginTop: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'whitesmoke',
    borderWidth: 2,
    borderColor: '#10217f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Arial',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    fontFamily: 'Arial',
  },
  addBtn: {
    backgroundColor: '#10217f',
    borderRadius: 6,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    marginTop: 16,
  },
  itemRow: {
    backgroundColor: 'white',
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  taskRow: {
    gap: 12,
  },
  checkbox: done => ({
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#10217f',
    backgroundColor: done ? '#10217f' : 'transparent',
  }),
  taskText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Arial',
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskInput: {
    flex: 1,
    fontSize: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    fontFamily: 'Arial',
  },
  taskMenu: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  menuBtn: {
    backgroundColor: '#10217f',
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 36,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 4,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    zIndex: 5,
  },
});