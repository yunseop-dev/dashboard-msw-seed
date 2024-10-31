import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test-utils';
import { Modal } from '../Modal';

describe('Modal', () => {
  it('모달이 닫혀있으면 아무것도 표시하지 않습니다.', () => {
    render(
      <Modal isOpen={false} onClose={() => { }} title="Test Modal">
        <div>Test Content</div>
      </Modal>
    );

    screen.queryByText('Test Modal')
  });

  it('모달이 열리면 컨텐츠를 표시합니다.', () => {
    render(
      <Modal isOpen={true} onClose={() => { }} title="Test Modal">
        <div>Test Content</div>
      </Modal>
    );

    screen.getByText('Test Modal');
    screen.getByText('Test Content');
  });

  it('닫기 버튼을 누르면 onClose가 실행됩니다.', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <div>Test Content</div>
      </Modal>
    );

    fireEvent.click(screen.getByTestId('close-modal'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('Esc 키를 누르면 onClose가 실행됩니다.', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <div>Test Content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});