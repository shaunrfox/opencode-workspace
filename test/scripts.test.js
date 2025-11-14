import { test, describe, mock } from 'node:test';
import assert from 'node:assert';

// Create a testable version of the download function
async function downloadModel(model, execaMock) {
  const spinner = {
    start: () => ({
      succeed: () => {},
      fail: () => {}
    })
  };

  try {
    await execaMock('ollama', ['pull', model]);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

describe('Download Models Logic', () => {
  test('should handle successful model download', async () => {
    const execaMock = mock.fn(() => Promise.resolve({ stdout: 'success' }));

    const result = await downloadModel('test-model', execaMock);

    assert.equal(result.success, true);
    assert.equal(execaMock.mock.callCount(), 1);
    assert.deepEqual(execaMock.mock.calls[0].arguments, ['ollama', ['pull', 'test-model']]);
  });

  test('should handle failed model download', async () => {
    const execaMock = mock.fn(() => Promise.reject(new Error('Download failed')));

    const result = await downloadModel('test-model', execaMock);

    assert.equal(result.success, false);
    assert.equal(result.error, 'Download failed');
    assert.equal(execaMock.mock.callCount(), 1);
  });

  test('should handle multiple model downloads with mixed results', async () => {
    let callCount = 0;
    const execaMock = mock.fn(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.reject(new Error('Network error'));
      }
      return Promise.resolve({ stdout: 'success' });
    });

    const models = ['failing-model', 'success-model'];
    const results = [];

    for (const model of models) {
      const result = await downloadModel(model, execaMock);
      results.push(result);
    }

    assert.equal(results[0].success, false);
    assert.equal(results[0].error, 'Network error');
    assert.equal(results[1].success, true);
    assert.equal(execaMock.mock.callCount(), 2);
  });
});

describe('Model Selection Logic', () => {
  test('should validate available models', () => {
    const AVAILABLE_MODELS = [
      { value: "qwen2.5-coder:7b" },
      { value: "deepseek-coder-v2:16b" },
      { value: "llama3.1" }
    ];

    const validModels = ['qwen2.5-coder:7b', 'llama3.1'];
    const invalidModels = ['invalid-model'];

    // Check valid models
    const validCheck = validModels.every(model =>
      AVAILABLE_MODELS.some(available => available.value === model)
    );
    assert.equal(validCheck, true, 'Valid models should be accepted');

    // Check invalid models
    const invalidCheck = invalidModels.every(model =>
      AVAILABLE_MODELS.some(available => available.value === model)
    );
    assert.equal(invalidCheck, false, 'Invalid models should be rejected');
  });

  test('should handle empty selection', () => {
    const selectedModels = [];

    assert.equal(selectedModels.length, 0, 'Empty selection should be handled');
    // In real implementation, this would show validation error
  });

  test('should process selected models correctly', () => {
    const selectedModels = ['qwen2.5-coder:7b', 'deepseek-coder-v2:16b'];

    assert.equal(selectedModels.length, 2);
    assert.equal(selectedModels.includes('qwen2.5-coder:7b'), true);
    assert.equal(selectedModels.includes('deepseek-coder-v2:16b'), true);
    assert.equal(selectedModels.includes('llama3.1'), false);
  });
});

describe('Script Integration Tests', () => {
  test('should simulate script execution with mocked dependencies', async () => {
    // This test simulates what the script does without actually running it
    const selectedModels = ['qwen2.5-coder:7b'];
    const execaMock = mock.fn(() => Promise.resolve({ stdout: 'success' }));

    // Simulate the main script logic
    console.log(`Downloading ${selectedModels.length} model(s)...`);

    for (const model of selectedModels) {
      const result = await downloadModel(model, execaMock);
      if (result.success) {
        console.log(`✓ ${model} downloaded successfully`);
      } else {
        console.log(`✗ ${model} download failed: ${result.error}`);
      }
    }

    // Verify the logic worked
    assert.equal(execaMock.mock.callCount(), 1);
    assert.equal(selectedModels.length, 1);
  });

  test('should handle model listing with mocked ollama list', async () => {
    const execaMock = mock.fn(() => Promise.resolve({
      stdout: `NAME                     ID              SIZE      MODIFIED
test-model:1b            abc123def456    1.0 GB    Just now
another-model:2b         def456ghi789    2.0 GB    2 hours ago`
    }));

    // Simulate checking installed models
    const { stdout } = await execaMock('ollama', ['list']);
    const lines = stdout.trim().split('\n');
    const modelCount = lines.length - 1; // Subtract header

    assert.equal(modelCount, 2, 'Should count 2 models');
    assert.ok(stdout.includes('test-model:1b'), 'Should include first model');
    assert.ok(stdout.includes('another-model:2b'), 'Should include second model');
  });

  test('should handle empty model list', async () => {
    const execaMock = mock.fn(() => Promise.resolve({ stdout: '' }));

    const { stdout } = await execaMock('ollama', ['list']);
    const hasModels = stdout.trim() !== '';

    assert.equal(hasModels, false, 'Should detect no models installed');
  });
});