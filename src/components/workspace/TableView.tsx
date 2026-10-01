import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../../theme';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useWorkspaceStore, TableRow } from '../../store/workspaceStore';

const COLUMNS = ['A', 'B', 'C', 'D', 'E'] as const;

export const TableView: React.FC = () => {
  const insets = useSafeAreaInsets();
  const docId = useWorkspaceStore(s => s.activeDocumentId);
  const tables = useWorkspaceStore(s => s.tables);
  const updateRow = useWorkspaceStore(s => s.updateTableRow);
  const sendToCanvas = useWorkspaceStore(s => s.sendToCanvas);

  const table = tables.find(t => t.id === docId);
  const [activeCell, setActiveCell] = useState<{ rowId: string; col: string } | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  const handleSave = () => {
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  if (!table) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>No Table Selected</Text>
      </View>
    );
  }

  const onCellChange = (rowId: string, col: string, raw: string) => {
    let value = raw;
    if (raw.startsWith('=') && raw.includes('+')) {
      try {
        const sum = raw.substring(1).split('+').reduce((acc, v) => acc + (parseFloat(v) || 0), 0);
        if (!isNaN(sum)) value = sum.toString();
      } catch { }
    }
    updateRow(table.id, rowId, col, value);
  };

  const onSendRow = (row: TableRow) => {
    const values = COLUMNS.map(col => (row as any)[col] || '').filter(Boolean).join(' — ');
    sendToCanvas(values || 'Empty row');
    Alert.alert('Sent to Canvas', 'Row data has been added to your Canvas.');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <TextInput
              style={styles.title}
              value={table.title}
              onChangeText={(t) => useWorkspaceStore.getState().updateTableTitle(table.id, t)}
              placeholder="Untitled Table"
              placeholderTextColor={Theme.colors.textSecondary}
            />
            <Text style={styles.subtitle}>Structure and track your work</Text>
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Feather name={saveStatus === 'saved' ? 'check' : 'save'} size={16} color="#FFF" />
            <Text style={styles.saveBtnText}>{saveStatus === 'saved' ? 'Saved!' : 'Save'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.formulaBar}>
          <Text style={styles.fxIcon}>fx</Text>
          <Text style={styles.fxText}>
            {activeCell ? `Cell ${activeCell.col}${table.rows.findIndex(r => r.id === activeCell.rowId) + 1}` : 'Select a cell to edit'}
          </Text>
        </View>
      </View>

      <ScrollView horizontal bounces={false}>
        <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: insets.bottom > 0 ? insets.bottom + 80 : 96 }}>
          <View style={styles.row}>
            <View style={[styles.cell, styles.headerCell, { width: 50 }]} />
            {COLUMNS.map(col => (
              <View key={col} style={[styles.cell, styles.headerCell]}>
                <Text style={styles.headerText}>{col}</Text>
              </View>
            ))}
            <View style={[styles.cell, styles.headerCell, { width: 60 }]} />
          </View>

          {table.rows.map((row, i) => (
            <View key={row.id} style={[styles.row, i % 2 === 1 && styles.rowAlt]}>
              <View style={[styles.cell, styles.numCell, { width: 50 }]}>
                <Text style={styles.numText}>{i + 1}</Text>
              </View>
              {COLUMNS.map(col => {
                const active = activeCell?.rowId === row.id && activeCell?.col === col;
                return (
                  <TouchableOpacity
                    key={col}
                    style={[styles.cell, active && styles.activeCell]}
                    onPress={() => setActiveCell({ rowId: row.id, col })}
                    activeOpacity={0.7}
                  >
                    <TextInput
                      style={styles.cellInput}
                      value={(row as any)[col] || ''}
                      onChangeText={txt => onCellChange(row.id, col, txt)}
                      onFocus={() => setActiveCell({ rowId: row.id, col })}
                      placeholder="..."
                      placeholderTextColor="#CCC"
                    />
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                style={[styles.cell, { width: 60, alignItems: 'center', justifyContent: 'center' }]}
                onPress={() => onSendRow(row)}
              >
                <MaterialCommunityIcons name="transit-connection-variant" size={16} color={Theme.colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.divider,
  },
  title: {
    fontSize: 24,
    fontFamily: Theme.typography.fontFamily.bold,
    color: Theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Theme.typography.fontFamily.regular,
    color: Theme.colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  formulaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Theme.colors.divider,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  fxIcon: {
    fontFamily: Theme.typography.fontFamily.bold,
    color: Theme.colors.primary,
    marginRight: 8,
  },
  fxText: {
    fontFamily: Theme.typography.fontFamily.regular,
    color: Theme.colors.textSecondary,
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.divider,
  },
  rowAlt: {
    backgroundColor: 'rgba(247, 245, 242, 0.5)',
  },
  cell: {
    width: 120,
    minHeight: 44,
    borderRightWidth: 1,
    borderRightColor: Theme.colors.divider,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  headerCell: { backgroundColor: Theme.colors.bg, justifyContent: 'center' },
  headerText: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: 13,
    color: Theme.colors.primary,
    textAlign: 'center',
  },
  numCell: { backgroundColor: Theme.colors.bg, alignItems: 'center' },
  numText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  cellInput: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: 14,
    color: Theme.colors.text,
    width: '100%',
    height: '100%',
  },
  activeCell: {
    borderWidth: 2,
    borderColor: Theme.colors.primary,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  saveBtnText: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: 13,
    color: '#FFF',
  },
});
