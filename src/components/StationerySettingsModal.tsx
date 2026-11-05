import React from 'react';
import { LetterDocument } from '../types/letter';
import { X, SlidersHorizontal, Check } from 'lucide-react';

interface StationerySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: LetterDocument;
  onUpdateDocument: (updated: Partial<LetterDocument>) => void;
}

export const StationerySettingsModal: React.FC<StationerySettingsModalProps> = ({
  isOpen,
  onClose,
  document,
  onUpdateDocument,
}) => {
  if (!isOpen) return null;

  const letterhead = document.letterhead;
  const sender = document.sender;
  const recipient = document.recipient;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Format & Letterhead</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Letterhead Switch & Details */}
          <div className="space-y-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-800/20">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                  Letterhead
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={letterhead.enabled}
                  onChange={(e) =>
                    onUpdateDocument({
                      letterhead: { ...letterhead, enabled: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-neutral-600 peer-checked:bg-neutral-900 dark:peer-checked:bg-neutral-100"></div>
              </label>
            </div>

            {letterhead.enabled && (
              <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-700/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-neutral-600 dark:text-neutral-400 font-medium">
                      Organization / Firm Name
                    </label>
                    <input
                      type="text"
                      value={letterhead.organizationName}
                      onChange={(e) =>
                        onUpdateDocument({
                          letterhead: { ...letterhead, organizationName: e.target.value },
                        })
                      }
                      className="w-full p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-neutral-600 dark:text-neutral-400 font-medium">
                      Division or Department
                    </label>
                    <input
                      type="text"
                      value={letterhead.division}
                      onChange={(e) =>
                        onUpdateDocument({
                          letterhead: { ...letterhead, division: e.target.value },
                        })
                      }
                      className="w-full p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium">
                    Corporate Address & Contact Line
                  </label>
                  <input
                    type="text"
                    value={letterhead.address}
                    onChange={(e) =>
                      onUpdateDocument({
                        letterhead: { ...letterhead, address: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-neutral-600 dark:text-neutral-400 font-medium">
                      Reference / Tracking Code
                    </label>
                    <input
                      type="text"
                      value={letterhead.referenceCode}
                      onChange={(e) =>
                        onUpdateDocument({
                          letterhead: { ...letterhead, referenceCode: e.target.value },
                        })
                      }
                      placeholder="e.g. REF-2026-902"
                      className="w-full p-2 font-mono bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={letterhead.confidentialBadge}
                        onChange={(e) =>
                          onUpdateDocument({
                            letterhead: { ...letterhead, confidentialBadge: e.target.checked },
                          })
                        }
                        className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                      />
                      <span className="text-neutral-700 dark:text-neutral-300">
                        Include "Confidential" stamp
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Date & Salutation Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-neutral-700 dark:text-neutral-300 font-semibold">
                Correspondence Date
              </label>
              <input
                type="text"
                value={document.date}
                onChange={(e) => onUpdateDocument({ date: e.target.value })}
                className="w-full p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-neutral-700 dark:text-neutral-300 font-semibold">
                Complimentary Close (Sign-Off)
              </label>
              <input
                type="text"
                value={document.signOff}
                onChange={(e) => onUpdateDocument({ signOff: e.target.value })}
                className="w-full p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>

          {/* Sender & Recipient Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sender */}
            <div className="p-3.5 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-2 bg-neutral-50/30 dark:bg-neutral-800/20">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
                Sender (Author)
              </span>
              <input
                type="text"
                placeholder="Name"
                value={sender.name}
                onChange={(e) => onUpdateDocument({ sender: { ...sender, name: e.target.value } })}
                className="w-full p-1.5 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded"
              />
              <input
                type="text"
                placeholder="Title / Role"
                value={sender.title}
                onChange={(e) => onUpdateDocument({ sender: { ...sender, title: e.target.value } })}
                className="w-full p-1.5 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded"
              />
              <input
                type="text"
                placeholder="Company / Organization"
                value={sender.company}
                onChange={(e) => onUpdateDocument({ sender: { ...sender, company: e.target.value } })}
                className="w-full p-1.5 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded"
              />
            </div>

            {/* Recipient */}
            <div className="p-3.5 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-2 bg-neutral-50/30 dark:bg-neutral-800/20">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
                Recipient (Addressee)
              </span>
              <input
                type="text"
                placeholder="Recipient Name"
                value={recipient.name}
                onChange={(e) => onUpdateDocument({ recipient: { ...recipient, name: e.target.value } })}
                className="w-full p-1.5 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded"
              />
              <input
                type="text"
                placeholder="Recipient Title"
                value={recipient.title}
                onChange={(e) => onUpdateDocument({ recipient: { ...recipient, title: e.target.value } })}
                className="w-full p-1.5 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded"
              />
              <input
                type="text"
                placeholder="Recipient Organization"
                value={recipient.company}
                onChange={(e) => onUpdateDocument({ recipient: { ...recipient, company: e.target.value } })}
                className="w-full p-1.5 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded"
              />
              <input
                type="text"
                placeholder="Street Address Line"
                value={recipient.addressLine1 || ''}
                onChange={(e) => onUpdateDocument({ recipient: { ...recipient, addressLine1: e.target.value } })}
                className="w-full p-1.5 text-xs bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
