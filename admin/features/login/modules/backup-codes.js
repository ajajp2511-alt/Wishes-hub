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
                    <p>Enter one of your single-use 8-character backup recovery codes.</p>
                    
                    <form id="backup-code-form">
                        <div class="input-group">
                            <input type="text" id="backup-code-input" required placeholder="e.g. AB12-CD34" autocomplete="off" autofocus>
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

            document.getElementById('backup-code-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const code = document.getElementById('backup-code-input').value.trim();
                await this.verifyBackupCode(userId, code, modal);
            });
        } else {
            modal.classList.add('active');
        }
    }

    /**
     * Verify the entered backup recovery code
     */
    async verifyBackupCode(userId, code, modalElement) {
        try {
            // Simulating API verification call
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Mock successful match condition (e.g., 'WH-BACKUP-99')
            if (code.toUpperCase() === 'WH-BACKUP-99') {
                alert('Backup code verified successfully!');
                modalElement.remove();
                if (this.onSuccessCallback) {
                    this.onSuccessCallback();
                }
            } else {
                alert('Invalid or already used backup code.');
            }
        } catch (error) {
            console.error('Backup Code Verification Error:', error);
            alert('Verification failed. Please try again.');
        }
    }
}
