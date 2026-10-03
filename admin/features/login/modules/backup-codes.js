/**
 * Wishes Hub - Backup Codes Module
 * Handles emergency recovery codes verification when primary MFA is unavailable.
 */

export class BackupCodesModule {
    constructor(onSuccessCallback) {
        this.onSuccessCallback = onSuccessCallback;
    }

    /**
     * Render Backup Code Verification Modal
     */
    renderBackupCodesModal(userId) {
        let modal = document.getElementById('backup-codes-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'backup-codes-modal';
            modal.className = 'modal-overlay active';
            modal.innerHTML = `
                <div class="modal-card">
                    <h3>Emergency Recovery Codes 🔑</h3>
                    <p>Enter one of your single-use backup recovery codes.</p>
                    
                    <form id="backup-code-form">
                        <div class="input-group">
                            <input type="text" id="backup-code-input" required placeholder="e.g. WH-BACKUP-99" autocomplete="off" autofocus style="text-transform: uppercase;">
                        </div>
                        <div class="modal-actions">
                            <button type="button" id="close-backup-modal" class="btn-secondary">Cancel</button>
                            <button type="submit" id="verify-backup-btn" class="btn-primary">Verify Code</button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('close-backup-modal').addEventListener('click', () => {
                modal.classList.remove('active');
            });

            const codeInput = document.getElementById('backup-code-input');
            
            // Auto uppercase formatting as user types
            if (codeInput) {
                codeInput.addEventListener('input', (e) => {
                    e.target.value = e.target.value.toUpperCase();
                });
            }

            document.getElementById('backup-code-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const code = codeInput ? codeInput.value.trim() : '';
                
                if (!code) {
                    alert('Please enter a backup code.');
                    return;
                }

                await this.verifyBackupCode(userId, code, modal);
            });
        } else {
            modal.classList.add('active');
            const codeInput = document.getElementById('backup-code-input');
            if (codeInput) codeInput.value = '';
        }
    }

    /**
     * Verify the entered backup recovery code
     */
    async verifyBackupCode(userId, code, modalElement) {
        const verifyBtn = document.getElementById('verify-backup-btn');

        try {
            if (verifyBtn) {
                verifyBtn.disabled = true;
                verifyBtn.dataset.originalText = verifyBtn.textContent;
                verifyBtn.textContent = 'Verifying...';
            }

            // Simulating API verification call
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Mock successful match condition (e.g., 'WH-BACKUP-99')
            if (code === 'WH-BACKUP-99') {
                alert('Backup code verified successfully!');
                if (modalElement && modalElement.parentNode) {
                    modalElement.remove();
                }
                if (this.onSuccessCallback) {
                    this.onSuccessCallback();
                }
            } else {
                alert('Invalid or already used backup code.');
            }
        } catch (error) {
            console.error('Backup Code Verification Error:', error);
            alert('Verification failed. Please try again.');
        } finally {
            if (verifyBtn) {
                verifyBtn.disabled = false;
                verifyBtn.textContent = verifyBtn.dataset.originalText || 'Verify Code';
            }
        }
    }
}
