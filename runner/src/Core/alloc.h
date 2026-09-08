namespace Core {
  /// @brief Creates a new memory allocation. This cannot be undone so think carefully. If it is created after initial loading of the binary,
  /// the value will be removed after a function execution is complete.
  /// @param size 
  /// @return The allocated memory address.
  void* alloc(unsigned long size);

  /// @brief Marks the location in memory which is safe to be deleted after a function is finished
  void loaded_binary();

  /// @brief Remove all dynamic memory from a function execution
  void finish_function();
}