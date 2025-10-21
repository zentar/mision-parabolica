import { renderHook, act } from '@testing-library/react';
import { useNotification } from '../../hooks/useNotification';

describe('useNotification Hook', () => {
  test('should initialize with empty notifications', () => {
    const { result } = renderHook(() => useNotification());
    
    expect(result.current.notifications).toEqual([]);
  });

  test('should add notification', () => {
    const { result } = renderHook(() => useNotification());
    
    act(() => {
      result.current.addNotification({
        type: 'success',
        title: 'Success',
        message: 'Operation completed'
      });
    });
    
    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0]).toMatchObject({
      type: 'success',
      title: 'Success',
      message: 'Operation completed'
    });
  });

  test('should remove notification', () => {
    const { result } = renderHook(() => useNotification());
    
    let notificationId;
    act(() => {
      notificationId = result.current.addNotification({
        type: 'info',
        title: 'Info',
        message: 'Information'
      });
    });
    
    expect(result.current.notifications).toHaveLength(1);
    
    act(() => {
      result.current.removeNotification(notificationId);
    });
    
    expect(result.current.notifications).toHaveLength(0);
  });

  test('should show success notification', () => {
    const { result } = renderHook(() => useNotification());
    
    act(() => {
      result.current.showSuccess('Operation successful');
    });
    
    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0]).toMatchObject({
      type: 'success',
      title: 'Éxito',
      message: 'Operation successful'
    });
  });

  test('should show error notification', () => {
    const { result } = renderHook(() => useNotification());
    
    act(() => {
      result.current.showError('Operation failed');
    });
    
    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0]).toMatchObject({
      type: 'error',
      title: 'Error',
      message: 'Operation failed'
    });
  });

  test('should show warning notification', () => {
    const { result } = renderHook(() => useNotification());
    
    act(() => {
      result.current.showWarning('Be careful');
    });
    
    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0]).toMatchObject({
      type: 'warning',
      title: 'Advertencia',
      message: 'Be careful'
    });
  });

  test('should show info notification', () => {
    const { result } = renderHook(() => useNotification());
    
    act(() => {
      result.current.showInfo('Here is some info');
    });
    
    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0]).toMatchObject({
      type: 'info',
      title: 'Información',
      message: 'Here is some info'
    });
  });

  test('should clear all notifications', () => {
    const { result } = renderHook(() => useNotification());
    
    act(() => {
      result.current.addNotification({ type: 'info', message: 'First' });
      result.current.addNotification({ type: 'success', message: 'Second' });
    });
    
    expect(result.current.notifications).toHaveLength(2);
    
    act(() => {
      result.current.clearAll();
    });
    
    expect(result.current.notifications).toHaveLength(0);
  });

  test('should set default duration', () => {
    const { result } = renderHook(() => useNotification());
    
    act(() => {
      result.current.addNotification({
        type: 'info',
        message: 'Test'
      });
    });
    
    expect(result.current.notifications[0].duration).toBe(5000);
  });

  test('should allow custom duration', () => {
    const { result } = renderHook(() => useNotification());
    
    act(() => {
      result.current.addNotification({
        type: 'info',
        message: 'Test',
        duration: 10000
      });
    });
    
    expect(result.current.notifications[0].duration).toBe(10000);
  });
});


