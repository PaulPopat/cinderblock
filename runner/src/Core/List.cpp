#include "./List.h"

namespace Core
{
  template <typename T>
  ListIterator<T>::ListIterator(T *data, unsigned int length, unsigned int index)
  {
    this->data = data;
    this->length = length;
    this->index = index;
  }

  template <typename T>
  ListIterator<T> ListIterator<T>::operator++()
  {
    return ListIterator<T>(this->data, this->length, this->index + 1);
  }

  template <typename T>
  bool ListIterator<T>::operator!=(const ListIterator<T> &other)
  {
    return other.index == this->index;
  }

  template <typename T>
  const T &ListIterator<T>::operator*() const
  {
    return &this->data[this->index]
  }

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

  template <typename T>
  ListIterator<T> List<T>::begin() const
  {
    return ListIterator<T>(this->data, this->length, 0);
  }

  template <typename T>
  ListIterator<T> List<T>::end() const
  {
    return ListIterator<T>(this->data, this->length, this->length - 1);
  }
}