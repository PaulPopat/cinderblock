#include "./List.h"

namespace Binary
{

  template <typename T>
  List<T>::List()
  {
    this->mem_length = 10;
    this->length = 0;
    this->data = new T[this->mem_length];
  }

  // This is highly wasteful and needs a rethink.
  template <typename T>
  void List<T>::push(T input)
  {
    if (this->length == this->mem_length)
    {
      auto old_mem = this->data;
      this->data = new T[this->mem_length + 10];
      this->mem_length += 10;

      for (int i = 0; i < this->length; i++)
      {
        this->data[i] = old_mem[i];
      }
    }

    this->data[this->length] = input;
    this->length += 1;
  }

  template <typename T>
  unsigned int &List<T>::get_length() const
  {
    return this->length;
  }

  template <typename T>
  T List<T>::get_item(unsigned int &index) const
  {
    return this->data[index];
  }
}