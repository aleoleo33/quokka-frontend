import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../../theme';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useWorkspaceStore } from '../../store/workspaceStore';

type HeadingLevel = 'body' | 'h1' | 'h2' | 'h3';
type FontSizeLabel = 'S' | 'M' | 'L' | 'XL';

const FONT_SIZES: Record<FontSizeLabel, number> = { S: 14, M: 16, L: 20, XL: 28 };
const HEADING_STYLES: Record<HeadingLevel, { fontSize: number; fontFamily: string; label: string }> = {
  body: { fontSize: 16, fontFamily: Theme.typography.fontFamily.regular, label: 'Body' },
  h1: { fontSize: 32, fontFamily: Theme.typography.fontFamily.bold, label: 'H1' },
  h2: { fontSize: 24, fontFamily: Theme.typography.fontFamily.semiBold, label: 'H2' },
  h3: { fontSize: 20, fontFamily: Theme.typography.fontFamily.medium, label: 'H3' },
};

export const NotesEditor: React.FC = () => {
  const insets = useSafeAreaInsets();
  const docId = useWorkspaceStore(s => s.activeDocumentId);
  const notes = useWorkspaceStore(s => s.notes);
  const updateNote = useWorkspaceStore(s => s.updateNote);
  const sendToCanvas = useWorkspaceStore(s => s.sendToCanvas);
  const sendToTable = useWorkspaceStore(s => s.sendToTable);

  const note = notes.find(n => n.id === docId);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const [activeHeading, setActiveHeading] = useState<HeadingLevel>('body');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [activeFontSize, setActiveFontSize] = useState<FontSizeLabel>('M');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showHeadingPicker, setShowHeadingPicker] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  const handleSave = () => {
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  if (!note) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No Note Selected</Text>
      </View>
    );
  }

  const selected = note.content.substring(selection.start, selection.end);
  const hasSelection = selection.end > selection.start;

  const send = (target: 'canvas' | 'table') => {
    if (!selected) return;
    if (target === 'canvas') {
      sendToCanvas(selected);
      Alert.alert('Sent to Canvas', 'Selected text added to Canvas.');
    } else {
      sendToTable(selected);
      Alert.alert('Sent to Table', 'Selected text added as a new row.');
    }
  };

  const headingInfo = HEADING_STYLES[activeHeading];

  const cycleAlign = () => {
    const order: ('left' | 'center' | 'right')[] = ['left', 'center', 'right'];
    const next = order[(order.indexOf(textAlign) + 1) % order.length];
    setTextAlign(next);
  };

  const alignIcon = textAlign === 'left' ? 'align-left' : textAlign === 'center' ? 'align-center' : 'align-right';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.title}
            value={note.title}
            onChangeText={(t) => useWorkspaceStore.getState().updateNoteTitle(note.id, t)}
            placeholder="Untitled Note"
            placeholderTextColor={Theme.colors.textSecondary}
          />
          <Text style={styles.subtitle}>Linear thought process</Text>
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Feather name={saveStatus === 'saved' ? 'check' : 'save'} size={16} color="#FFF" />
          <Text style={styles.saveBtnText}>{saveStatus === 'saved' ? 'Saved!' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formatBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.formatBarInner}>
          <TouchableOpacity
            style={[styles.formatBtn, showHeadingPicker && styles.formatBtnActive]}
            onPress={() => { setShowHeadingPicker(!showHeadingPicker); setShowFontPicker(false); }}
          >
            <Text style={[styles.formatBtnText, showHeadingPicker && styles.formatBtnTextActive]}>{headingInfo.label}</Text>
            <Feather name="chevron-down" size={12} color={showHeadingPicker ? '#FFFFFF' : Theme.colors.text} />
          </TouchableOpacity>

          <View style={styles.formatDivider} />

          <TouchableOpacity style={[styles.formatBtn, isBold && styles.formatBtnActive]} onPress={() => setIsBold(!isBold)}>
            <Text style={[styles.formatIcon, isBold && styles.formatBtnTextActive, { fontWeight: '700' }]}>B</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.formatBtn, isItalic && styles.formatBtnActive]} onPress={() => setIsItalic(!isItalic)}>
            <Text style={[styles.formatIcon, isItalic && styles.formatBtnTextActive, { fontStyle: 'italic' }]}>I</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.formatBtn, isUnderline && styles.formatBtnActive]} onPress={() => setIsUnderline(!isUnderline)}>
            <Text style={[styles.formatIcon, isUnderline && styles.formatBtnTextActive, { textDecorationLine: 'underline' }]}>U</Text>
          </TouchableOpacity>

          <View style={styles.formatDivider} />

          <TouchableOpacity
            style={[styles.formatBtn, showFontPicker && styles.formatBtnActive]}
            onPress={() => { setShowFontPicker(!showFontPicker); setShowHeadingPicker(false); }}
          >
            <Feather name="type" size={16} color={showFontPicker ? '#FFFFFF' : Theme.colors.text} />
            <Text style={[styles.formatBtnText, showFontPicker && styles.formatBtnTextActive, { marginLeft: 4 }]}>{activeFontSize}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.formatBtn} onPress={cycleAlign}>
            <Feather name={alignIcon as any} size={16} color={Theme.colors.text} />
          </TouchableOpacity>

          <View style={styles.formatDivider} />

          <TouchableOpacity style={styles.formatBtn} onPress={() => send('canvas')}>
            <MaterialCommunityIcons name="transit-connection-variant" size={16} color="#D97757" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.formatBtn} onPress={() => send('table')}>
            <MaterialCommunityIcons name="table" size={16} color="#4A7C59" />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {showHeadingPicker && (
        <View style={styles.dropdownPanel}>
          {(['body', 'h1', 'h2', 'h3'] as HeadingLevel[]).map(level => (
            <TouchableOpacity
              key={level}
              style={[styles.dropdownItem, activeHeading === level && styles.dropdownItemActive]}
              onPress={() => { setActiveHeading(level); setShowHeadingPicker(false); }}
            >
              <Text style={[
                styles.dropdownText,
                { fontSize: HEADING_STYLES[level].fontSize * 0.6, fontFamily: HEADING_STYLES[level].fontFamily },
                activeHeading === level && styles.dropdownTextActive,
              ]}>
                {HEADING_STYLES[level].label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {showFontPicker && (
        <View style={styles.dropdownPanel}>
          {(['S', 'M', 'L', 'XL'] as FontSizeLabel[]).map(size => (
            <TouchableOpacity
              key={size}
              style={[styles.dropdownItem, activeFontSize === size && styles.dropdownItemActive]}
              onPress={() => { setActiveFontSize(size); setShowFontPicker(false); }}
            >
              <Text style={[
                styles.dropdownText,
                { fontSize: FONT_SIZES[size] * 0.85 },
                activeFontSize === size && styles.dropdownTextActive,
              ]}>
                {size} — {FONT_SIZES[size]}px
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={[styles.editor, { paddingBottom: insets.bottom > 0 ? insets.bottom + 80 : 96 }]}>
        <TextInput
          style={[
            styles.input,
            {
              fontSize: activeHeading !== 'body' ? headingInfo.fontSize : FONT_SIZES[activeFontSize],
              fontFamily: headingInfo.fontFamily,
              fontWeight: isBold ? '700' : (activeHeading !== 'body' ? headingInfo.fontFamily.includes('Bold') ? '700' : '600' : 'normal') as any,
              fontStyle: isItalic ? 'italic' : 'normal',
              textDecorationLine: isUnderline ? 'underline' : 'none',
              textAlign,
            },
          ]}
          multiline
          value={note.content}
          onChangeText={text => updateNote(note.id, text)}
          onSelectionChange={e => setSelection(e.nativeEvent.selection)}
          placeholder="Start typing... tap toolbar to format"
          placeholderTextColor="#B0B0B0"
          textAlignVertical="top"
        />
      </View>

      {hasSelection && (
        <View style={[styles.selectionBar, { bottom: insets.bottom > 0 ? insets.bottom + 76 : 80 }]}>
          <TouchableOpacity style={styles.selectionBtn} onPress={() => send('canvas')}>
            <MaterialCommunityIcons name="transit-connection-variant" size={18} color="#D97757" />
            <Text style={styles.selectionLabel}>To Canvas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectionBtn} onPress={() => send('table')}>
            <MaterialCommunityIcons name="table" size={18} color="#4A7C59" />
            <Text style={styles.selectionLabel}>To Table</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: {
    fontSize: 18,
    color: Theme.colors.textSecondary,
    fontFamily: Theme.typography.fontFamily.medium,
  },
  header: {
    padding: Theme.spacing.lg,
    paddingBottom: Theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: Theme.typography.fontFamily.bold,
    color: Theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Theme.typography.fontFamily.regular,
    color: Theme.colors.textSecondary,
    marginTop: 4,
  },

  formatBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  formatBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 2,
  },
  formatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    marginHorizontal: 2,
  },
  formatBtnActive: {
    backgroundColor: Theme.colors.primary,
  },
  formatBtnText: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: 13,
    color: Theme.colors.text,
  },
  formatBtnTextActive: {
    color: '#FFFFFF',
  },
  formatIcon: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: 16,
    color: Theme.colors.text,
  },
  formatDivider: {
    width: 1,
    height: 20,
    backgroundColor: Theme.colors.divider,
    marginHorizontal: 6,
  },

  dropdownPanel: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: Theme.colors.divider,
    paddingHorizontal: 16,
    paddingVertical: 8,
    ...Theme.shadow.subtle,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginVertical: 2,
  },
  dropdownItemActive: {
    backgroundColor: Theme.colors.border,
  },
  dropdownText: {
    fontFamily: Theme.typography.fontFamily.medium,
    color: Theme.colors.text,
  },
  dropdownTextActive: {
    color: Theme.colors.primary,
  },

  editor: { flex: 1, paddingHorizontal: Theme.spacing.lg, paddingTop: Theme.spacing.md },
  input: {
    flex: 1,
    color: Theme.colors.text,
    lineHeight: 28,
  },

  selectionBar: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...Theme.shadow.elevated,
    borderWidth: 1,
    borderColor: Theme.colors.borderLight,
  },
  selectionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  selectionLabel: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: 12,
    marginLeft: 6,
    color: Theme.colors.text,
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
